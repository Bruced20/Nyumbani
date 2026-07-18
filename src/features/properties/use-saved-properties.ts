'use client'

import React from 'react'

const STORAGE_KEY = 'nyumbani_saved_properties'
const SYNC_EVENT = 'nyumbani:saved-properties'

// localStorage is an external store — subscribe via useSyncExternalStore.
// The snapshot is the raw string (stable reference), parsed with useMemo.
function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  window.addEventListener(SYNC_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(SYNC_EVENT, callback)
  }
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function getServerSnapshot(): string {
  return '[]'
}

function parseSlugs(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

/**
 * Persistent saved properties (by slug) backed by localStorage.
 * Anonymous-friendly — no account required, matching Nyumbani's no-paywall
 * ethos. Cross-tab consistent via the storage event and cross-component
 * consistent via a same-tab custom event.
 */
export function useSavedProperties() {
  const raw = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const saved = React.useMemo(() => parseSlugs(raw), [raw])

  const isSaved = React.useCallback((slug: string) => saved.includes(slug), [saved])

  const toggle = React.useCallback((slug: string): boolean => {
    const current = parseSlugs(getSnapshot())
    const wasSaved = current.includes(slug)
    const next = wasSaved ? current.filter((s) => s !== slug) : [...current, slug]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore write failures (private mode, quota)
    }
    window.dispatchEvent(new Event(SYNC_EVENT))
    return !wasSaved // the new saved state
  }, [])

  return { saved, isSaved, toggle }
}
