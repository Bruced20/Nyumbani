'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  /** The user's stored preference: light, dark, or system. */
  theme: ThemeChoice
  /** The theme actually applied to the DOM after resolving `system`. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeChoice) => void
  /** Convenience: cycle light → dark → system → light. */
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'nyumbani-theme'

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredTheme(): ThemeChoice {
  if (typeof window === 'undefined') return 'system'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // localStorage unavailable — fall back to system.
  }
  return 'system'
}

/**
 * Theme Provider.
 * Persists the user's light/dark/system choice and keeps the `dark` class on
 * <html> in sync. The pre-paint script in layout.tsx handles the very first
 * render to avoid a flash; this provider owns all subsequent changes.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy init reads the stored choice once; the pre-paint script already set
  // the matching `dark` class, so first paint is consistent.
  const [theme, setThemeState] = useState<ThemeChoice>(readStoredTheme)
  // Track the OS preference as state so `system` resolves reactively. Updated
  // only by the media-query listener — never inside a render-triggered effect.
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark)

  // resolvedTheme is derived during render — no setState, no cascade.
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  // Single side-effect: keep the DOM class in sync with the resolved theme.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  // Subscribe to OS preference changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setTheme = useCallback((choice: ThemeChoice) => {
    setThemeState(choice)
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // ignore write failures (private mode, etc.)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
