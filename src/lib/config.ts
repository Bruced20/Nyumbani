import { z } from 'zod'

// Define the environment schema with optional/empty-friendly local fallbacks
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(5, 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid token.'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(5, 'SUPABASE_SERVICE_ROLE_KEY must be a valid token.')
    .optional()
    .or(z.literal('')),
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL must be a valid URL.')
    .optional()
    .or(z.literal('')),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().or(z.literal('')),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * Environment configuration loader and validator.
 * Validates environment variables at application startup and fails fast on error.
 * Bypasses hard crashes during Next.js production build phases.
 */
function validateConfig() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || undefined,
    NODE_ENV: process.env.NODE_ENV,
  }

  const result = envSchema.safeParse(env)

  if (!result.success) {
    // Bypass hard crash during compile build cycles (where secrets aren't injected)
    const isBuildPhase =
      process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test'
    if (isBuildPhase) {
      console.warn('⚠️ Environment validation warnings (bypassed for build time compilation):')
      return env as unknown as z.infer<typeof envSchema>
    }

    console.error('❌ Environment validation failed! Invalid configuration:')
    console.error(JSON.stringify(result.error.format(), null, 2))
    throw new Error('Critical configuration mismatch. Process terminated.')
  }

  return result.data
}

export const config = validateConfig()
export type Config = typeof config
