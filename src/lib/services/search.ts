import { PropertyRepository } from '../repositories/properties'
import { ReviewRepository } from '../repositories/reviews'
import { mapProperty, Property } from '../mappers'
import { FilterState } from '@/features/properties/search-filters'
import { PropertyService } from './properties'
import { MOCK_PROPERTIES } from '../mock-data'
import { unstable_cache } from 'next/cache'

/**
 * Search Service Layer.
 * Exposes location suggestions, handles search parameter filtering, and applies custom sorting.
 */
export const SearchService = {
  /**
   * Search properties matching parameters.
   */
  async search(filters: FilterState, sort: string): Promise<Property[]> {
    let allProperties: Property[] = []

    try {
      await PropertyService.ensureSeeded()

      // 1. Fetch all properties from database (cached to maximize performance)
      const fetchAllWithDetails = unstable_cache(
        async () => {
          const rows = await PropertyRepository.findAll()
          const list: Property[] = []

          for (const row of rows) {
            const detail = await PropertyRepository.findBySlug(row.slug)
            if (detail) {
              const reviews = await ReviewRepository.findByPropertyId(row.id)
              list.push(
                mapProperty(row, detail.images, detail.amenities, detail.nearbyPlaces, reviews)
              )
            }
          }
          return list
        },
        ['search-properties-pool'],
        { revalidate: 600, tags: ['properties', 'search-pool'] }
      )

      allProperties = await fetchAllWithDetails()
    } catch (err) {
      console.warn(
        'Supabase offline: falling back to static mock data list for search filtering',
        err
      )
      allProperties = MOCK_PROPERTIES as unknown as Property[]
    }

    // 2. Perform advanced filtering (conforming to Sprint 3B rules)
    const filtered = allProperties.filter((prop) => {
      // Neighborhood check
      if (
        filters.neighborhood &&
        !prop.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
      ) {
        return false
      }
      // House Type check
      if (filters.houseType && prop.houseType !== filters.houseType) return false
      // Rent range check
      if (prop.rentMin < filters.rentMin || prop.rentMax > filters.rentMax) return false
      // Water reliability check
      if (filters.waterRating && prop.waterRating !== filters.waterRating) return false
      // Power / Electricity check
      if (filters.electricityRating && prop.electricityRating !== filters.electricityRating)
        return false
      // Internet Type check
      if (filters.internetType && prop.internetType !== filters.internetType) return false
      // Security check
      if (filters.securityRating && prop.securityRating !== filters.securityRating) return false
      // Parking check
      if (filters.parking && prop.parking !== filters.parking) return false
      // Road Access check
      if (filters.roadType && prop.roadType !== filters.roadType) return false
      // Garbage collection check
      if (filters.garbageReliability && prop.garbageReliability !== filters.garbageReliability)
        return false
      // Verified listing check
      if (filters.verifiedOnly && !prop.isVerified) return false
      // Community listed check
      if (filters.communityListedOnly && prop.isVerified) return false
      // Vacancy Available check
      if (filters.vacancyOnly && !prop.vacancyStatus) return false
      // Recently Updated check (last 14 days relative to 2026-07-03)
      if (filters.recentlyUpdated) {
        const referenceTime = new Date('2026-07-03T09:14:04+03:00').getTime()
        const diff = referenceTime - new Date(prop.updatedAt).getTime()
        const fourteenDays = 14 * 24 * 60 * 60 * 1000
        if (diff > fourteenDays) return false
      }

      return true
    })

    // 3. Apply advanced sorting
    if (sort === 'rent-low') {
      return filtered.sort((a, b) => a.rentMin - b.rentMin)
    }
    if (sort === 'rent-high') {
      return filtered.sort((a, b) => b.rentMax - a.rentMax)
    }
    if (sort === 'health') {
      return filtered.sort((a, b) => b.healthScore - a.healthScore)
    }
    if (sort === 'reviews') {
      return filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }
    if (sort === 'recent') {
      return filtered.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    }
    if (sort === 'alpha') {
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered // Best Match (default)
  },
}
