'use client'

import React from 'react'
import { Navbar as UINavbar } from '@ui/navigation'
import { useAuth } from '@/features/auth/auth-provider'
import { useTheme } from '@/features/theme/theme-provider'

/**
 * Connected Navbar Wrapper.
 * Bridges the presentation Navbar component from packages/ui with application AuthService.
 */
export function Navbar() {
  const { user, profile, signOut, triggerProtectedAction } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <UINavbar
      isAuthenticated={!!user}
      userName={profile?.fullName || user?.email?.split('@')[0] || 'User'}
      avatarUrl={profile?.avatarUrl || undefined}
      onSignOut={signOut}
      onSignOpen={() => triggerProtectedAction(() => {})}
      theme={theme}
      onSetTheme={setTheme}
    />
  )
}
