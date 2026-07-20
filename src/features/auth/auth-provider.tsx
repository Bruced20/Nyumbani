'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, mapProfileRow } from '@/lib/mappers'
import { Modal } from '@ui/overlay'
import { Button } from '@ui/button'
import { logger } from '@/lib/utils/logger'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  triggerProtectedAction: (action: () => void) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider.
 * Maintains browser-side session status, handles auth modal popup cascades,
 * and passes the active profile context to children.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Helper to load profile from client-side Supabase query
    const loadProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (error) {
          throw error
        }

        if (data) {
          setProfile(mapProfileRow(data))
        }
      } catch (err) {
        logger.error('AuthProvider: Error fetching profile details.', { err })
      }
    }

    // 1. Initial Session Fetch
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        }
      } catch (err) {
        logger.error('AuthProvider: Error initializing user session.', { err })
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info(`AuthProvider: Auth event observed: "${event}"`)
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)

        // If there was a pending action, execute it now
        if (pendingAction) {
          logger.info('AuthProvider: Executing pending action post-login.')
          pendingAction()
          setPendingAction(null)
        }
      } else {
        setUser(null)
        setProfile(null)
        setPendingAction(null)
      }
      setIsLoading(false)
    })

    // 3. Listen to URL parameters for auth redirects
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'required') {
      logger.info('AuthProvider: Detected "auth=required" parameter in URL. Launching modal.')
      // Defer state update using setTimeout to prevent react-hooks/set-state-in-effect warning
      setTimeout(() => {
        setIsModalOpen(true)
      }, 0)

      // Clean up the URL parameter without triggering a reload
      const cleanSearch = window.location.search
        .replace(/([?&])auth=required(&?)/, (_, p1, p2) => (p1 === '?' && p2 ? '?' : ''))
        .replace(/[?&]$/, '')

      const cleanUrl = window.location.pathname + cleanSearch
      window.history.replaceState({}, '', cleanUrl)
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [pendingAction, supabase])

  const signIn = async () => {
    try {
      // Pass the current window location as redirect parameter
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })

      if (error) throw error
    } catch (err) {
      logger.error('AuthProvider: Google Sign-in trigger failed.', { err })
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (err) {
      logger.error('AuthProvider: Sign-out trigger failed.', { err })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Action guard. If logged in, runs the action.
   * If guest, displays the Authentication modal and saves the action to run after successful sign-in.
   */
  const triggerProtectedAction = (action: () => void) => {
    if (user) {
      action()
    } else {
      logger.info('AuthProvider: Intercepted protected action. Opening AuthModal.')
      setPendingAction(() => action)
      setIsModalOpen(true)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signOut,
        triggerProtectedAction,
      }}
    >
      {children}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setPendingAction(null)
        }}
        title="Sign in to Nyumbani"
      >
        <div className="flex flex-col gap-sm py-xs">
          <p className="text-[14px] text-text-muted leading-relaxed">
            Join Kenya&apos;s community-driven rental intelligence network to write reviews, report
            issues, and claim property ownership.
          </p>

          <Button
            onClick={signIn}
            variant="primary"
            className="w-full flex items-center justify-center gap-xs whitespace-nowrap"
          >
            {/* Premium Google Logo SVG */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </Modal>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
