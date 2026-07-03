'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Navbar, Footer } from '@ui/navigation'
import { Container } from '@ui/layout'
import { PropertyCard } from '@ui/card'
import { EmptyState, ErrorState, Skeleton } from '@ui/feedback'
import { SearchBar } from '@/features/properties/search-bar'
import { SearchFilters, FilterState } from '@/features/properties/search-filters'
import { MapPreview } from '@/features/properties/map-preview'
import { Property } from '@/lib/mappers'
import { NEARBY_NEIGHBORHOODS } from '@/lib/mock-data'
import { AlertOctagon, X, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { listContainerVariants, listItemVariants, SPRING_SUBTLE } from '@ui/animations'

interface SearchPageContentClientProps {
  properties: Property[]
  filters: FilterState
  sortState: string
  errorOccurred: boolean
}

/**
 * Client-side Search dashboard.
 * Receives filtered properties from server components and handles route transitions.
 */
export function SearchPageContentClient({
  properties,
  filters,
  sortState,
  errorOccurred,
}: SearchPageContentClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // 1. Sync local changes back to the URL parameters
  const updateURLParams = (newFilters: FilterState, newSort: string) => {
    const params = new URLSearchParams()

    if (newFilters.neighborhood) params.set('location', newFilters.neighborhood)
    if (newFilters.houseType) params.set('type', newFilters.houseType)
    if (newFilters.rentMin > 0) params.set('minRent', newFilters.rentMin.toString())
    if (newFilters.rentMax < 150000) params.set('maxRent', newFilters.rentMax.toString())
    if (newFilters.waterRating) params.set('water', newFilters.waterRating)
    if (newFilters.electricityRating) params.set('electricity', newFilters.electricityRating)
    if (newFilters.internetType) params.set('internet', newFilters.internetType)
    if (newFilters.securityRating) params.set('security', newFilters.securityRating)
    if (newFilters.parking) params.set('parking', newFilters.parking)
    if (newFilters.roadType) params.set('roadAccess', newFilters.roadType)
    if (newFilters.garbageReliability) params.set('garbage', newFilters.garbageReliability)
    if (newFilters.verifiedOnly) params.set('verified', 'true')
    if (newFilters.communityListedOnly) params.set('community', 'true')
    if (newFilters.vacancyOnly) params.set('vacancy', 'true')
    if (newFilters.recentlyUpdated) params.set('recent', 'true')
    if (newSort !== 'match') params.set('sort', newSort)

    startTransition(() => {
      router.push(`/search?${params.toString()}`, { scroll: false })
    })
  }

  const setFilters = (newFilters: FilterState) => {
    updateURLParams(newFilters, sortState)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateURLParams(filters, e.target.value)
  }

  // 2. Generate active filter chips directly during render
  const activeChips: { key: keyof FilterState; label: string }[] = []
  if (filters.neighborhood)
    activeChips.push({ key: 'neighborhood', label: `📍 ${filters.neighborhood}` })
  if (filters.houseType) activeChips.push({ key: 'houseType', label: `🏠 ${filters.houseType}` })
  if (filters.rentMin > 0 || filters.rentMax < 150000) {
    const minText = filters.rentMin > 0 ? `${filters.rentMin / 1000}k` : '0'
    const maxText = filters.rentMax < 150000 ? `${filters.rentMax / 1000}k` : '150k'
    activeChips.push({ key: 'rentMax', label: `💰 ${minText}–${maxText}` })
  }
  if (filters.waterRating)
    activeChips.push({ key: 'waterRating', label: `💧 Water: ${filters.waterRating}` })
  if (filters.electricityRating)
    activeChips.push({ key: 'electricityRating', label: `⚡ Power: ${filters.electricityRating}` })
  if (filters.internetType)
    activeChips.push({ key: 'internetType', label: `🌐 ${filters.internetType.split(' ')[0]}` })
  if (filters.securityRating)
    activeChips.push({ key: 'securityRating', label: `🛡️ Security: ${filters.securityRating}` })
  if (filters.parking) activeChips.push({ key: 'parking', label: `🚗 Parking: ${filters.parking}` })
  if (filters.roadType) activeChips.push({ key: 'roadType', label: `🛣️ Road: ${filters.roadType}` })
  if (filters.garbageReliability)
    activeChips.push({
      key: 'garbageReliability',
      label: `🗑️ Garbage: ${filters.garbageReliability}`,
    })
  if (filters.verifiedOnly) activeChips.push({ key: 'verifiedOnly', label: `⭐ Verified Owner` })
  if (filters.communityListedOnly)
    activeChips.push({ key: 'communityListedOnly', label: `👥 Community Listed` })
  if (filters.vacancyOnly) activeChips.push({ key: 'vacancyOnly', label: `🔑 Vacancy Available` })
  if (filters.recentlyUpdated)
    activeChips.push({ key: 'recentlyUpdated', label: `📅 Recently Updated` })

  const removeChip = (key: keyof FilterState) => {
    const defaults = {
      rentMin: 0,
      rentMax: 150000,
      neighborhood: '',
      houseType: '',
      waterRating: '',
      electricityRating: '',
      internetType: '',
      securityRating: '',
      parking: '',
      roadType: '',
      garbageReliability: '',
      verifiedOnly: false,
      communityListedOnly: false,
      vacancyOnly: false,
      recentlyUpdated: false,
    }
    if (key === 'rentMax' || key === 'rentMin') {
      setFilters({ ...filters, rentMin: 0, rentMax: 150000 })
    } else {
      setFilters({ ...filters, [key]: defaults[key] })
    }
  }

  const handlePropertySelect = (slug: string) => {
    router.push(`/property/${slug}`)
  }

  // Get nearby suggestions if search location results in empty states
  const key = filters.neighborhood.toLowerCase().trim()
  const nearbySuggestions = NEARBY_NEIGHBORHOODS[key] || [
    'Westlands',
    'Kilimani',
    'Kileleshwa',
    'Lavington',
  ]

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-sm">
        <Container className="max-w-6xl flex flex-col gap-sm">
          {/* Header search bar overlay controller */}
          <div className="flex flex-col gap-xs pb-xs border-b border-border-subtle">
            <SearchBar initialQuery={filters.neighborhood} />
          </div>

          <div className="flex flex-col lg:flex-row gap-sm items-start">
            {/* Left Pane: Filters & Listing results list */}
            <div className="w-full lg:w-[60%] flex flex-col gap-sm">
              {/* Filters form block */}
              <SearchFilters filters={filters} onFiltersChange={setFilters} />

              {/* Active Filter Chips */}
              <AnimatePresence>
                {activeChips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-wrap gap-xs items-center"
                  >
                    {activeChips.map((chip) => (
                      <motion.div
                        layout
                        key={chip.label}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={SPRING_SUBTLE}
                        className="inline-flex items-center gap-[4px] px-xs py-[4px] bg-brand-indigo/5 text-brand-indigo border border-brand-indigo/15 rounded-pill text-[12px] font-semibold select-none"
                      >
                        {chip.label}
                        <button
                          onClick={() => removeChip(chip.key)}
                          className="hover:bg-brand-indigo/10 p-[2px] rounded-pill cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}

                    <button
                      onClick={() =>
                        setFilters({
                          rentMin: 0,
                          rentMax: 150000,
                          neighborhood: '',
                          houseType: '',
                          waterRating: '',
                          electricityRating: '',
                          internetType: '',
                          securityRating: '',
                          parking: '',
                          roadType: '',
                          garbageReliability: '',
                          verifiedOnly: false,
                          communityListedOnly: false,
                          vacancyOnly: false,
                          recentlyUpdated: false,
                        })
                      }
                      className="text-[12px] font-bold text-text-muted hover:text-text-primary transition-colors cursor-pointer select-none ml-xxs"
                    >
                      Clear All
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sorting HUD Bar */}
              <div className="flex justify-between items-center bg-bg-secondary border border-border-subtle p-xs rounded-symmetric shadow-sm mt-xxs">
                <span className="text-[13px] font-medium text-text-muted">
                  Showing {isPending ? '...' : properties.length} homes
                </span>

                <div className="flex items-center gap-xxs text-[13px] text-text-primary">
                  <ArrowUpDown size={14} className="text-text-muted shrink-0" />
                  <span className="font-medium text-text-muted">Sort:</span>
                  <select
                    value={sortState}
                    onChange={handleSortChange}
                    className="bg-transparent border-none font-semibold text-brand-indigo focus:outline-none cursor-pointer"
                  >
                    <option value="match">Best Match</option>
                    <option value="rent-low">Lowest Rent</option>
                    <option value="rent-high">Highest Rent</option>
                    <option value="health">Health Score</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="recent">Recently Updated</option>
                    <option value="alpha">Alphabetical</option>
                  </select>
                </div>
              </div>

              {/* Content Grid results layout */}
              <div className="flex flex-col gap-xs">
                {errorOccurred ? (
                  <ErrorState
                    message="A simulated database connection timeout occurred while fetching search listings."
                    onRetry={() => router.push('/search')}
                  />
                ) : isPending ? (
                  // Loading skeletons grid
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
                ) : properties.length === 0 ? (
                  // Upgraded Empty State matching the prompt criteria
                  <div className="flex flex-col gap-md">
                    <EmptyState
                      title="We couldn't find homes matching your search"
                      description="Try widening your budget, removing a filter, or exploring nearby areas."
                      icon={<AlertOctagon size={32} className="text-text-muted" />}
                    />

                    {/* Nearby suggestions HUD */}
                    <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
                      <h4 className="font-semibold text-[13px] text-text-primary mb-xs">
                        Explore Nearby Neighborhoods:
                      </h4>
                      <div className="flex flex-wrap gap-xs">
                        {nearbySuggestions.map((hood) => (
                          <button
                            key={hood}
                            onClick={() =>
                              setFilters({
                                ...filters,
                                neighborhood: hood,
                              })
                            }
                            className="px-xs py-xxs bg-bg-primary border border-border-subtle text-text-primary rounded-soft text-[12px] font-semibold hover:border-brand-indigo transition-colors cursor-pointer"
                          >
                            📍 {hood}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Properties List (using spring-based list staggers)
                  <motion.div
                    variants={listContainerVariants}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 gap-sm"
                  >
                    {properties.map((prop) => (
                      <motion.div key={prop.id} variants={listItemVariants}>
                        <PropertyCard
                          name={prop.name}
                          neighborhood={prop.neighborhood}
                          rentMin={prop.rentMin}
                          rentMax={prop.rentMax}
                          houseType={prop.houseType}
                          healthScore={prop.healthScore}
                          isVerified={prop.isVerified}
                          waterRating={
                            prop.waterRating === 'Excellent'
                              ? 5
                              : prop.waterRating === 'Good'
                                ? 4
                                : 3
                          }
                          securityRating={
                            prop.securityRating === 'Excellent'
                              ? 5
                              : prop.securityRating === 'Good'
                                ? 4
                                : 3
                          }
                          caretakerRating={prop.healthScore >= 4 ? 4.5 : 3.5}
                          onClick={() => handlePropertySelect(prop.slug)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Pane: Map Preview Simulator */}
            <div className="w-full lg:w-[40%] lg:sticky lg:top-[80px]">
              <MapPreview properties={properties} onSelectProperty={handlePropertySelect} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
