'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SearchInput } from '@ui/input'
import { Button } from '@ui/button'
import { KENYAN_LOCATIONS } from '@/lib/mock-data'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleVariants } from '@ui/animations'
import { Search, Clock, MapPin, X } from 'lucide-react'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
}

const LOCAL_STORAGE_KEY = 'nyumbani_recent_searches'

/**
 * Upgraded SearchBar component with autocomplete, Kenyan location suggestions,
 * keyboard navigation (arrows, Enter, Escape), and local storage recent searches.
 * Completely optimized to eliminate synchronous setStates in useEffect.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  placeholder = 'Search by neighborhood (e.g. Westlands, Kilimani, Ruiru)...',
}) => {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialQuery)
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const [isSearching, setIsSearching] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)

  // 1. Click outside listener to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 2. Compute suggestions directly during render using useMemo
  const suggestions = React.useMemo(() => {
    if (!query.trim()) return []

    return KENYAN_LOCATIONS.filter((loc) => loc.toLowerCase().startsWith(query.toLowerCase()))
      .concat(
        KENYAN_LOCATIONS.filter(
          (loc) =>
            loc.toLowerCase().includes(query.toLowerCase()) &&
            !loc.toLowerCase().startsWith(query.toLowerCase())
        )
      )
      .slice(0, 6) // limit to top 6 hits
  }, [query])

  // 3. Save search to localStorage
  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return
    const cleanSearch = searchTerm.trim()

    // Filter duplicates and prepend new search
    const updated = [
      cleanSearch,
      ...recentSearches.filter((s) => s.toLowerCase() !== cleanSearch.toLowerCase()),
    ].slice(0, 10)

    setRecentSearches(updated)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Fail-safe
    }
  }

  // 4. Trigger navigation search
  const triggerSearch = (searchTerm: string) => {
    setIsSearching(true)
    saveSearch(searchTerm)
    setIsOpen(false)

    setTimeout(() => {
      setIsSearching(false)
      if (searchTerm.trim()) {
        router.push(`/search?location=${encodeURIComponent(searchTerm.trim())}`)
      } else {
        router.push('/search')
      }
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    triggerSearch(query)
  }

  // 5. Handle Keyboard Navigation inside suggestions dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    const combinedList = query.trim() ? suggestions : recentSearches

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1 >= combinedList.length ? 0 : prev + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 < 0 ? combinedList.length - 1 : prev - 1))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < combinedList.length) {
        e.preventDefault()
        const selected = combinedList[activeIndex]
        setQuery(selected)
        triggerSearch(selected)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  const clearRecentSearch = (e: React.MouseEvent, target: string) => {
    e.stopPropagation()
    const updated = recentSearches.filter((s) => s !== target)
    setRecentSearches(updated)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Fail-safe
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-xs w-full">
        <div className="relative flex-1">
          <SearchInput
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="search-suggestions"
          />
        </div>
        <Button type="submit" variant="primary" isLoading={isSearching} className="h-full shrink-0">
          <Search size={16} className={isSearching ? 'animate-spin' : ''} />
          Search
        </Button>
      </form>

      {/* Autocomplete suggestions popup overlay */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            id="search-suggestions"
            variants={scaleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-full left-0 right-0 mt-xxs bg-bg-primary border border-border-subtle rounded-symmetric shadow-xl z-50 overflow-hidden max-h-[350px] overflow-y-auto"
          >
            {/* 1. Autocomplete Hits */}
            {query.trim() && suggestions.length > 0 && (
              <div className="p-xxs flex flex-col">
                <span className="px-xs py-xxs text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
                  Matching Locations
                </span>
                {suggestions.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item)
                      triggerSearch(item)
                    }}
                    className={`flex items-center gap-xs w-full px-xs py-[10px] text-left text-[14px] font-medium rounded-soft transition-colors cursor-pointer ${
                      index === activeIndex
                        ? 'bg-neutral-100 text-brand-indigo font-semibold'
                        : 'text-text-primary hover:bg-neutral-50'
                    }`}
                  >
                    <MapPin size={16} className="text-text-muted shrink-0" />
                    {item}
                  </button>
                ))}
              </div>
            )}

            {/* 2. Recent Searches (shown when input is blank or no recommendations match) */}
            {recentSearches.length > 0 && (!query.trim() || suggestions.length === 0) && (
              <div className="p-xxs flex flex-col">
                <span className="px-xs py-xxs text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
                  Recent Searches
                </span>
                {recentSearches.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item)
                      triggerSearch(item)
                    }}
                    className={`group flex items-center justify-between w-full px-xs py-[10px] rounded-soft transition-colors cursor-pointer ${
                      index === activeIndex ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-xs text-[14px] font-medium text-text-primary">
                      <Clock size={16} className="text-text-muted shrink-0" />
                      {item}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => clearRecentSearch(e, item)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-coral p-[2px] rounded-pill hover:bg-neutral-100 cursor-pointer transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
