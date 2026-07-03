import { vi, describe, it, expect, beforeEach } from 'vitest'
import { SearchService } from './search'
import { PropertyRepository } from '../repositories/properties'
import { ReviewRepository } from '../repositories/reviews'
import { FilterState } from '@/features/properties/search-filters'

vi.mock('../repositories/properties', () => ({
  PropertyRepository: {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
  },
}))

vi.mock('../repositories/reviews', () => ({
  ReviewRepository: {
    findByPropertyId: vi.fn(),
  },
}))

vi.mock('./properties', () => ({
  PropertyService: {
    ensureSeeded: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({
  unstable_cache: <T>(cb: T): T => cb,
  revalidateTag: vi.fn(),
}))

describe('SearchService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should filter properties matching neighborhood and sort by rent ascending', async () => {
    const mockPropertyRows = [
      {
        id: '1',
        slug: 'a',
        name: 'Apartment A',
        rent_min: 20000,
        rent_max: 30000,
        neighborhood: 'Kilimani',
        house_type: 'Bedsitter',
        water_source: 'Borehole',
        parking_spaces: 'assigned',
        road_access: 'Tarmac',
        deposit_conditions: '1 Month',
        public_transport_dist: '5 min',
        health_score: 4.5,
        is_verified: true,
        updated_at: '2026-07-01T00:00:00Z',
        internet_providers: ['Safaricom'],
      },
      {
        id: '2',
        slug: 'b',
        name: 'Apartment B',
        rent_min: 15000,
        rent_max: 25000,
        neighborhood: 'Kilimani',
        house_type: 'Bedsitter',
        water_source: 'Borehole',
        parking_spaces: 'assigned',
        road_access: 'Tarmac',
        deposit_conditions: '1 Month',
        public_transport_dist: '5 min',
        health_score: 4.2,
        is_verified: true,
        updated_at: '2026-07-02T00:00:00Z',
        internet_providers: ['Safaricom'],
      },
      {
        id: '3',
        slug: 'c',
        name: 'Apartment C',
        rent_min: 50000,
        rent_max: 60000,
        neighborhood: 'Westlands',
        house_type: 'Bedsitter',
        water_source: 'Borehole',
        parking_spaces: 'assigned',
        road_access: 'Tarmac',
        deposit_conditions: '1 Month',
        public_transport_dist: '5 min',
        health_score: 4.8,
        is_verified: true,
        updated_at: '2026-07-03T00:00:00Z',
        internet_providers: ['Safaricom'],
      },
    ]

    vi.mocked(PropertyRepository.findAll).mockResolvedValue(
      mockPropertyRows as unknown as Awaited<ReturnType<typeof PropertyRepository.findAll>>
    )
    vi.mocked(PropertyRepository.findBySlug).mockImplementation(async (slug) => {
      const match = mockPropertyRows.find((p) => p.slug === slug)
      if (!match) return null
      return {
        property: match,
        images: [],
        amenities: [],
        nearbyPlaces: [],
      } as unknown as Awaited<ReturnType<typeof PropertyRepository.findBySlug>>
    })
    vi.mocked(ReviewRepository.findByPropertyId).mockResolvedValue([])

    const filters: FilterState = {
      rentMin: 0,
      rentMax: 150000,
      neighborhood: 'Kilimani',
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

    const result = await SearchService.search(filters, 'rent-low')

    // Expecting Kilimani listings sorted by rent min ascending
    expect(result).toHaveLength(2)
    expect(result[0].slug).toBe('b') // 15,000 rent
    expect(result[1].slug).toBe('a') // 20,000 rent
  })

  it('should filter properties matching verified listing only flag', async () => {
    const mockPropertyRows = [
      {
        id: '1',
        slug: 'a',
        name: 'Apartment A',
        rent_min: 20000,
        rent_max: 30000,
        neighborhood: 'Kilimani',
        house_type: 'Bedsitter',
        water_source: 'Borehole',
        parking_spaces: 'assigned',
        road_access: 'Tarmac',
        deposit_conditions: '1 Month',
        public_transport_dist: '5 min',
        health_score: 4.5,
        is_verified: true,
        updated_at: '2026-07-01T00:00:00Z',
        internet_providers: ['Safaricom'],
      },
      {
        id: '2',
        slug: 'b',
        name: 'Apartment B',
        rent_min: 15000,
        rent_max: 25000,
        neighborhood: 'Kilimani',
        house_type: 'Bedsitter',
        water_source: 'Borehole',
        parking_spaces: 'assigned',
        road_access: 'Tarmac',
        deposit_conditions: '1 Month',
        public_transport_dist: '5 min',
        health_score: 4.2,
        is_verified: false,
        updated_at: '2026-07-02T00:00:00Z',
        internet_providers: ['Safaricom'],
      },
    ]

    vi.mocked(PropertyRepository.findAll).mockResolvedValue(
      mockPropertyRows as unknown as Awaited<ReturnType<typeof PropertyRepository.findAll>>
    )
    vi.mocked(PropertyRepository.findBySlug).mockImplementation(async (slug) => {
      const match = mockPropertyRows.find((p) => p.slug === slug)
      if (!match) return null
      return {
        property: match,
        images: [],
        amenities: [],
        nearbyPlaces: [],
      } as unknown as Awaited<ReturnType<typeof PropertyRepository.findBySlug>>
    })
    vi.mocked(ReviewRepository.findByPropertyId).mockResolvedValue([])

    const filters: FilterState = {
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
      verifiedOnly: true, // Only verified listings
      communityListedOnly: false,
      vacancyOnly: false,
      recentlyUpdated: false,
    }

    const result = await SearchService.search(filters, 'match')
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('a')
  })
})
