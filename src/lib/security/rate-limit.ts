import { Redis } from '@upstash/redis'

// Initialize Upstash Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
}

/**
 * Abstracted Rate Limiting check utilizing Upstash Redis.
 * Enforces sliding window limitations on specified client IPs.
 *
 * @param ip Client IP address
 * @param limit Max requests allowed in the window
 * @param windowSeconds Window length in seconds
 */
export async function checkRateLimit(
  ip: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  // If Redis environment variables are missing, fallback to true (fail-open for resilience)
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { success: true, limit, remaining: limit }
  }

  const key = `ratelimit:${ip}`

  try {
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }

    const remaining = Math.max(0, limit - current)
    const success = current <= limit

    return {
      success,
      limit,
      remaining,
    }
  } catch (error) {
    console.error('Rate limiting error (failing open):', error)
    return { success: true, limit, remaining: limit }
  }
}
