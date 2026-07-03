import { vi, describe, it, expect, beforeEach } from 'vitest'
import { PropertyRepository } from './properties'
import { createStaticClient } from '../supabase/server'

// Mock the Supabase client builder
vi.mock('../supabase/server', () => {
  const fromMock = vi.fn()
  const mockClient = {
    from: fromMock,
  }
  return {
    createStaticClient: () => mockClient,
    createClient: () => mockClient,
  }
})

describe('PropertyRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should find property details by slug', async () => {
    const mockProperty = { id: 'p123', slug: 'greenhouse-kilimani', name: 'Greenhouse' }
    const mockImages = [{ id: 'img1', property_id: 'p123', image_url: 'url1' }]
    const mockAmenities = [{ id: 'am1', property_id: 'p123', amenity_name: 'Pool' }]
    const mockNearby = [
      { id: 'nb1', property_id: 'p123', name: 'School', type: 'School', distance: '1km' },
    ]

    const client = createStaticClient()

    // Mock the chained query builders
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: mockProperty, error: null }),
      }),
    })

    const selectDetailsMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    // Stub database client returns
    vi.mocked(client.from).mockImplementation((table: string) => {
      if (table === 'properties') {
        return { select: selectMock } as unknown as ReturnType<typeof client.from>
      }
      if (table === 'property_images') {
        return {
          select: vi
            .fn()
            .mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: mockImages, error: null }) }),
        } as unknown as ReturnType<typeof client.from>
      }
      if (table === 'property_amenities') {
        return {
          select: vi
            .fn()
            .mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: mockAmenities, error: null }),
            }),
        } as unknown as ReturnType<typeof client.from>
      }
      if (table === 'nearby_places') {
        return {
          select: vi
            .fn()
            .mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: mockNearby, error: null }) }),
        } as unknown as ReturnType<typeof client.from>
      }
      return { select: selectDetailsMock } as unknown as ReturnType<typeof client.from>
    })

    const result = await PropertyRepository.findBySlug('greenhouse-kilimani')

    expect(result).not.toBeNull()
    expect(result?.property.id).toBe('p123')
    expect(result?.images[0].image_url).toBe('url1')
    expect(result?.amenities[0].amenity_name).toBe('Pool')
    expect(result?.nearbyPlaces[0].name).toBe('School')
  })

  it('should find featured properties ordered by health score', async () => {
    const mockPropertiesList = [
      { id: '1', name: 'A', health_score: 4.8 },
      { id: '2', name: 'B', health_score: 4.6 },
    ]

    const client = createStaticClient()
    vi.mocked(client.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: mockPropertiesList, error: null }),
        }),
      }),
    } as unknown as ReturnType<typeof client.from>)

    const result = await PropertyRepository.findFeatured(2)
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('A')
  })
})
