import React, { Suspense } from 'react'
import { LoadingSpinner } from '@ui/feedback'
import { FilterState } from '@/features/properties/search-filters'
import { SearchService } from '@/lib/services/search'
import { SearchPageContentClient } from './search-client'
import { Property } from '@/lib/mappers'

interface SearchPageProps {
  searchParams: Promise<{
    location?: string
    type?: string
    minRent?: string
    maxRent?: string
    water?: string
    electricity?: string
    internet?: string
    security?: string
    parking?: string
    roadAccess?: string
    garbage?: string
    verified?: string
    community?: string
    vacancy?: string
    recent?: string
    sort?: string
  }>
}

/**
 * Public search and listings discovery page.
 * Implements a pure server-driven data layer, passing queries and filter outputs
 * to the search client wrapper.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const filters: FilterState = {
    rentMin: parseInt(params.minRent || '0'),
    rentMax: parseInt(params.maxRent || '150000'),
    neighborhood: params.location || '',
    houseType: params.type || '',
    waterRating: params.water || '',
    electricityRating: params.electricity || '',
    internetType: params.internet || '',
    securityRating: params.security || '',
    parking: params.parking || '',
    roadType: params.roadAccess || '',
    garbageReliability: params.garbage || '',
    verifiedOnly: params.verified === 'true',
    communityListedOnly: params.community === 'true',
    vacancyOnly: params.vacancy === 'true',
    recentlyUpdated: params.recent === 'true',
  }

  const sortState = params.sort || 'match'

  let properties: Property[] = []
  let errorOccurred = false

  try {
    // Perform filtering and sorting in SearchService on the Server
    properties = await SearchService.search(filters, sortState)
  } catch {
    errorOccurred = true
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-bg-primary">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <SearchPageContentClient
        properties={properties}
        filters={filters}
        sortState={sortState}
        errorOccurred={errorOccurred}
      />
    </Suspense>
  )
}
