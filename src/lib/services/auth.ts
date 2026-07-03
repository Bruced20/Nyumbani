import { AuthRepository } from '../repositories/auth'
import { ProfileRepository } from '../repositories/profiles'
import { mapProfileRow } from '../mappers'
import { logger } from '../utils/logger'

/**
 * Authentication Service.
 * Orchestrates login status checks, session refreshes, and profile mapping.
 */
export const AuthService = {
  /**
   * Triggers the Google OAuth login redirect.
   */
  async signInWithGoogle(redirectTo: string) {
    logger.info('AuthService: Redirecting to Google OAuth...', { redirectTo })
    return await AuthRepository.signInWithGoogle(redirectTo)
  },

  /**
   * Signs the user out of the active session.
   */
  async signOut() {
    logger.info('AuthService: Signing out active user session.')
    await AuthRepository.signOut()
  },

  /**
   * Returns the mapped Profile of the currently logged-in user, or null if guest.
   * Auto-syncs last login metrics.
   */
  async getCurrentUser() {
    const user = await AuthRepository.getUser()
    if (!user) {
      return null
    }

    try {
      // 1. Verify and sync profile metadata
      const profileRow = await this.syncUserProfile(user)
      return mapProfileRow(profileRow)
    } catch (error) {
      logger.error('AuthService: Error resolving profile for authenticated user.', {
        userId: user.id,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  },

  /**
   * Checks for existing user profiles, performing self-sealing inserts/updates.
   */
  async syncUserProfile(user: {
    id: string
    email?: string
    app_metadata?: Record<string, unknown>
    user_metadata?: Record<string, unknown>
  }) {
    const existing = await ProfileRepository.findById(user.id)
    const provider = (user.app_metadata?.provider as string) || 'google'
    const nowString = new Date().toISOString()

    if (!existing) {
      // Create profile record if database trigger has not executed yet
      logger.warn('AuthService: Profile missing during auth check, forcing creation.', {
        userId: user.id,
      })
      return await ProfileRepository.create({
        id: user.id,
        email: user.email || '',
        full_name: (user.user_metadata?.full_name as string) || '',
        avatar_url: (user.user_metadata?.avatar_url as string) || '',
        role: 'Renter',
        last_login_at: nowString,
        provider,
      })
    }

    // Update only last login timestamp and provider
    return await ProfileRepository.update(user.id, {
      last_login_at: nowString,
      provider,
      updated_at: nowString,
    })
  },
}
