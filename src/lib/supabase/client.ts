import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../types/database.types'

/**
 * Creates a browser-safe Supabase client.
 * Enforces Row Level Security (RLS) on all client-side queries.
 */
export const createClient = (): SupabaseClient<Database> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing on the client.')
  }

  return createBrowserClient<Database>(url, anonKey)
}
