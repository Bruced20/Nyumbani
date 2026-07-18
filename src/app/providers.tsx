'use client'

import React from 'react'
import { ThemeProvider } from '@/features/theme/theme-provider'
import { ToastProvider } from '@ui/feedback/toast-context'
import { AuthProvider } from '@/features/auth/auth-provider'

/**
 * Root client provider composition.
 * Order matters: Theme (owns the dark class) wraps Toast (needs themed tokens)
 * wraps Auth (fires toasts on sign-in/out flows in later slices).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
