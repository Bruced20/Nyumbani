import { createClient, createStaticClient } from '../supabase/server'
import { createClient as createBrowserClient } from '../supabase/client'
import { DatabaseError } from '../errors'

/**
 * Authentication Repository.
 * Wraps Supabase Auth API calls.
 */
export const AuthRepository = {
  /**
   * Get the current authenticated user session (Server-side).
   */
  async getUser() {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      // Return null rather than throwing to handle guest states gracefully
      return null
    }
    return user
  },

  /**
   * Get current authenticated user session (Static, cookie-free context).
   */
  async getStaticUser() {
    const supabase = createStaticClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) return null
    return user
  },

  /**
   * Triggers Google OAuth sign-in flow (Client-side trigger).
   */
  async signInWithGoogle(redirectTo: string) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })

    if (error) {
      throw new DatabaseError('Failed to trigger Google OAuth sign-in.', { rawError: error })
    }
    return data
  },

  /**
   * Sign out the active user session.
   */
  async signOut() {
    const isServer = typeof window === 'undefined'
    const supabase = isServer ? await createClient() : createBrowserClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new DatabaseError('Failed to sign out user session.', { rawError: error })
    }
  },
}
