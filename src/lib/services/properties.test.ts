import { vi, describe, it, expect, beforeEach } from 'vitest'
import { PropertyService } from './properties'
import { PropertyRepository } from '../repositories/properties'
import { ReviewRepository } from '../repositories/reviews'

vi.mock('../repositories/properties', () => ({
  PropertyRepository: {
    findFeatured: vi.fn(),
    findBySlug: vi.fn(),
    findNearby: vi.fn(),
  },
}))

vi.mock('../repositories/reviews', () => ({
  ReviewRepository: {
    findByPropertyId: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({
  unstable_cache: <T>(cb: T): T => cb,
  revalidateTag: vi.fn(),
}))

describe('PropertyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch property details and map them to domain structure', async () => {
    const mockPropertyRow = {
      id: 'p1',
      slug: 'sunrise',
      name: 'Sunrise',
      rent_min: 10000,
      rent_max: 20000,
      neighborhood: 'Westlands',
      house_type: 'One Bedroom',
      water_source: 'Borehole',
      parking_spaces: 'assigned',
      road_access: 'Tarmac',
      deposit_conditions: '1 Month',
      public_transport_dist: '5 min',
      health_score: 4.5,
      is_verified: true,
      updated_at: '2026-07-01T00:00:00Z',
      internet_providers: ['Safaricom'],
    }

    vi.mocked(PropertyRepository.findBySlug).mockResolvedValue({
      property: mockPropertyRow,
      images: [],
      amenities: [],
      nearbyPlaces: [],
    } as unknown as Awaited<ReturnType<typeof PropertyRepository.findBySlug>>)
    vi.mocked(ReviewRepository.findByPropertyId).mockResolvedValue([])

    // Mock ensureSeeded so it doesn't run admin DB check
    vi.spyOn(PropertyService, 'ensureSeeded').mockResolvedValue()

    const result = await PropertyService.getPropertyBySlug('sunrise')

    expect(result).not.toBeNull()
    expect(result.id).toBe('p1')
    expect(result.name).toBe('Sunrise')
    expect(result.waterRating).toBe('Excellent') // default derived
  })
})
