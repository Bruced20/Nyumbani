import { NextResponse } from 'next/server'
import { createStaticClient } from '@/lib/supabase/server'
import { Redis } from '@upstash/redis'
import { execSync } from 'child_process'
import pkg from '../../../../package.json'

// Instantiate Redis using configuration keys
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Resolve Git Commit SHA if available
function getCommitHash(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA
  }
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

/**
 * Health Check API Endpoint.
 * `/api/health`
 * Diagnostics check for Database, Storage, and Redis connectivity.
 */
export async function GET() {
  const checks: Record<string, 'healthy' | 'unhealthy'> = {
    database: 'unhealthy',
    storage: 'unhealthy',
    redis: 'unhealthy',
  }

  // 1. Database Check
  try {
    const supabase = createStaticClient()
    const { error } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .limit(1)

    if (!error) {
      checks.database = 'healthy'
    }
  } catch {
    // handled via checks status
  }

  // 2. Storage Check
  try {
    const supabase = createStaticClient()
    const { error } = await supabase.storage.getBucket('properties')
    if (!error) {
      checks.storage = 'healthy'
    }
  } catch {
    // handled via checks status
  }

  // 3. Redis Check
  try {
    const pong = await redis.ping()
    if (pong === 'PONG') {
      checks.redis = 'healthy'
    }
  } catch {
    // handled via checks status
  }

  const isHealthy = Object.values(checks).every((status) => status === 'healthy')

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      version: pkg.version || 'development',
      environment: process.env.NODE_ENV || 'development',
      commit: getCommitHash(),
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  )
}
