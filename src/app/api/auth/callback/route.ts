import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AuthService } from '@/lib/services/auth'
import { logger } from '@/lib/utils/logger'

/**
 * Supabase OAuth Callback Handler.
 * Exchanges single-use authentication codes for user sessions.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        throw error
      }

      if (user) {
        // Sync profiles and update last login parameters
        logger.info('OAuth Callback: Code exchange successful. Syncing profile...', {
          userId: user.id,
        })
        await AuthService.syncUserProfile(user)
      }
    } catch (err) {
      logger.error('OAuth Callback: Error exchanging auth code for session.', {
        error: err instanceof Error ? err.message : err,
      })
      // Redirect to home page with error parameter
      return NextResponse.redirect(new URL('/?auth_error=exchange_failed', requestUrl.origin))
    }
  }

  // URL redirect cleanup
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
