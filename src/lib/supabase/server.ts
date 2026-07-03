import { createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '../../types/database.types'

/**
 * Creates a server-safe Supabase client for Server Components,
 * Route Handlers, and Server Actions.
 * Handles reading and writing HTTP session cookies automatically.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing on the server.')
  }

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}

/**
 * Creates a server-side high-privilege Supabase client using the Service Role Key.
 * WARNING: This client bypasses Row Level Security (RLS).
 * Use only inside administrative tasks or secure server actions.
 */
export function createAdminClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase admin environment variables are missing on the server.')
  }

  return createServerClient<Database>(url, serviceKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // Service role operations do not write back to client cookies.
      },
    },
  })
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a static, cookie-free Supabase client.
 * Safe to execute inside Next.js cache scopes (e.g. unstable_cache) during build time.
 */
export function createStaticClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing.')
  }

  return createSupabaseClient<Database>(url, anonKey)
}
