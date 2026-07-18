'use client'

import React from 'react'
import type { FilterState } from './search-filters'
import { describeFilters, filtersSignature } from './saved-search-utils'

const STORAGE_KEY = 'nyumbani_saved_searches'
const SYNC_EVENT = 'nyumbani:saved-searches'

export interface SavedSearch {
  id: string
  label: string
  filters: FilterState
  createdAt: string
}

// localStorage is an external store — subscribe via useSyncExternalStore.
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

function parseSearches(raw: string): SavedSearch[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(next: SavedSearch[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore write failures (private mode, quota)
  }
  window.dispatchEvent(new Event(SYNC_EVENT))
}

/**
 * Persistent saved searches backed by localStorage. Anonymous-friendly.
 * De-duplicates by filter signature so saving the same filters twice is a no-op.
 */
export function useSavedSearches() {
  const raw = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const searches = React.useMemo(() => parseSearches(raw), [raw])

  /** Save the current filters. Returns false if an identical search already exists. */
  const save = React.useCallback((filters: FilterState): boolean => {
    const current = parseSearches(getSnapshot())
    const sig = filtersSignature(filters)
    if (current.some((s) => s.id === sig)) {
      return false
    }
    const entry: SavedSearch = {
      // Deterministic id from the signature — duplicates impossible by construction.
      id: sig,
      label: describeFilters(filters) || 'All homes',
      filters,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...current].slice(0, 20))
    return true
  }, [])

  const remove = React.useCallback((id: string) => {
    persist(parseSearches(getSnapshot()).filter((s) => s.id !== id))
  }, [])

  return { searches, save, remove }
}
