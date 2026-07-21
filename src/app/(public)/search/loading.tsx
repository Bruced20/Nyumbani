import React from 'react'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'
import { Skeleton } from '@ui/feedback'

/**
 * Search route loading skeleton.
 * Mirrors the search results layout (header + filter bar + card grid) so the
 * transition reads as the page assembling, not a generic spinner.
 */
export default function SearchLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="flex flex-col gap-lg">
          {/* Search bar + heading */}
          <div className="flex flex-col gap-sm">
            <Skeleton className="h-12 w-full max-w-2xl rounded-symmetric" />
            <Skeleton className="h-5 w-56" />
          </div>

          {/* Filter chips row */}
          <div className="flex flex-wrap gap-xs">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-pill" />
            ))}
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-bg-secondary border border-border-subtle rounded-symmetric overflow-hidden shadow-sm"
              >
                <Skeleton className="w-full aspect-[4/3] rounded-none" />
                <div className="p-sm flex flex-col gap-xs">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-2/3 mt-xs" />
                  <div className="flex gap-sm mt-sm pt-xs border-t border-border-subtle">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
