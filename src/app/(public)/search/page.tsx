'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar, Footer } from '@ui/navigation'
import { Container } from '@ui/layout'
import { H1, Small } from '@ui/typography'
import { PropertyCard } from '@ui/card'
import { EmptyState, ErrorState, Skeleton, LoadingSpinner } from '@ui/feedback'
import { SearchBar } from '@/features/properties/search-bar'
import { SearchFilters, FilterState } from '@/features/properties/search-filters'
import { MapPreview } from '@/features/properties/map-preview'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { AlertOctagon } from 'lucide-react'

/**
 * Inner Search Results Content.
 * Uses searchParams which bails out of static generation unless wrapped in Suspense.
 */
function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get('q') || ''

  // 1. Client Filter States
  const [filters, setFiltersState] = React.useState<FilterState>({
    rentMin: 0,
    rentMax: 100000,
    neighborhood: '',
    verifiedOnly: false,
  })

  const [isLoading, setIsLoading] = React.useState(false)

  // Computed render value: True if query term is "error"
  const errorOccurred = searchQuery.toLowerCase() === 'error'

  // 2. Trigger loading skeleton transitions when filter updates
  const setFilters = (newFilters: FilterState) => {
    setIsLoading(true)
    setFiltersState(newFilters)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 450)
    return () => clearTimeout(timer)
  }

  // 3. Perform filtering on mock dataset
  const filteredProperties = MOCK_PROPERTIES.filter((prop) => {
    // Search Query match (looks at name or neighborhood)
    const matchesSearch =
      searchQuery === '' ||
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())

    // Neighborhood match
    const matchesNeighborhood =
      filters.neighborhood === '' ||
      prop.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())

    // Rent bounds match
    const matchesRent = prop.rentMin >= filters.rentMin && prop.rentMax <= filters.rentMax

    // Verified landlord toggle match
    const matchesVerified = !filters.verifiedOnly || prop.isVerified

    return matchesSearch && matchesNeighborhood && matchesRent && matchesVerified
  })

  const handlePropertySelect = (slug: string) => {
    router.push(`/property/${slug}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-sm">
        <Container className="max-w-6xl flex flex-col gap-sm">
          {/* Header search bar overlay controller */}
          <div className="flex flex-col gap-xs pb-xs border-b border-border-subtle">
            <SearchBar initialQuery={searchQuery} />
            {searchQuery && (
              <Small className="text-[13px] text-text-muted">
                Showing results for &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </Small>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-sm items-start">
            {/* Left Pane: Filters & Listing results list */}
            <div className="w-full lg:w-[60%] flex flex-col gap-sm">
              <SearchFilters filters={filters} onFiltersChange={setFilters} />

              <div className="flex flex-col gap-xs mt-xxs">
                <H1 className="text-subtitle font-semibold">
                  Listings Available ({isLoading ? '...' : filteredProperties.length})
                </H1>

                {/* Render States (Loading, Error, Empty, List) */}
                {errorOccurred ? (
                  <ErrorState
                    message="A simulated database connection timeout occurred while fetching search listings."
                    onRetry={() => router.push('/search')}
                  />
                ) : isLoading ? (
                  // Loading Skeletons
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="border border-border-subtle rounded-symmetric p-xs flex flex-col gap-xs"
                      >
                        <Skeleton className="w-full aspect-[4/3]" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredProperties.length === 0 ? (
                  // Empty State
                  <EmptyState
                    title="No rentals match your criteria"
                    description="Try widening your rent bounds, selecting different neighborhoods, or search terms."
                    actionLabel="Clear Filters"
                    onActionClick={() =>
                      setFilters({
                        rentMin: 0,
                        rentMax: 100000,
                        neighborhood: '',
                        verifiedOnly: false,
                      })
                    }
                    icon={<AlertOctagon size={32} className="text-text-muted" />}
                  />
                ) : (
                  // Property List Grid
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                    {filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        name={prop.name}
                        neighborhood={prop.neighborhood}
                        rentMin={prop.rentMin}
                        rentMax={prop.rentMax}
                        houseType={prop.houseType}
                        healthScore={prop.healthScore}
                        isVerified={prop.isVerified}
                        waterRating={prop.waterRating}
                        securityRating={prop.securityRating}
                        caretakerRating={prop.caretakerRating}
                        onClick={() => handlePropertySelect(prop.slug)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Lightweight Static Map Component */}
            <div className="w-full lg:w-[40%] lg:sticky lg:top-[80px] min-h-[400px] h-[calc(100vh-140px)]">
              <MapPreview properties={filteredProperties} onSelectProperty={handlePropertySelect} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}

/**
 * SearchPage wrapper containing Suspense boundary.
 * Prevents CSR bailout errors during static page builds.
 */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-bg-primary">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
