'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SearchInput } from '@ui/input'
import { Button } from '@ui/button'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
}

/**
 * Reusable SearchBar controller.
 * Navigates to /search with the search term query parameter.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  placeholder = 'Search by neighborhood or apartment name (e.g. Westlands, Kilimani)...',
}) => {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-xs w-full max-w-2xl">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
      <Button type="submit" variant="primary" className="h-full shrink-0">
        Search Rentals
      </Button>
    </form>
  )
}
