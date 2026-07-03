import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ReviewService } from './reviews'
import { ReviewRepository } from '../repositories/reviews'
import { Database } from '@/types/database.types'

vi.mock('../repositories/reviews', () => ({
  ReviewRepository: {
    findByPropertyId: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({
  unstable_cache: <T>(cb: T): T => cb,
  revalidateTag: vi.fn(),
}))

type ReviewRow = Database['public']['Tables']['reviews']['Row']

describe('ReviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get reviews by property and map them to domain structure', async () => {
    const mockReviewRows = [
      {
        id: 'r1',
        property_id: 'p1',
        user_id: 'u1',
        role_tag: 'Current Resident' as const,
        water_rating: 4,
        security_rating: 4,
        caretaker_rating: 4,
        recommend: 'Yes' as const,
        comment: 'Nice',
        is_moderated: false,
        created_at: '2026-07-01T00:00:00Z',
        updated_at: '2026-07-01T00:00:00Z',
      },
    ]

    vi.mocked(ReviewRepository.findByPropertyId).mockResolvedValue(
      mockReviewRows as unknown as ReviewRow[]
    )

    const result = await ReviewService.getReviewsByProperty('p1')

    expect(result).toHaveLength(1)
    expect(result[0].comment).toBe('Nice')
    expect(result[0].rating).toBe(4)
  })

  it('should submit a review and map it', async () => {
    const mockCreatedRow = {
      id: 'r2',
      property_id: 'p1',
      user_id: 'u2',
      role_tag: 'Current Resident' as const,
      water_rating: 5,
      security_rating: 5,
      caretaker_rating: 5,
      recommend: 'Yes' as const,
      comment: 'Excellent',
      is_moderated: false,
      created_at: '2026-07-02T00:00:00Z',
      updated_at: '2026-07-02T00:00:00Z',
    }

    vi.mocked(ReviewRepository.create).mockResolvedValue(mockCreatedRow as unknown as ReviewRow)

    const payload = {
      propertyId: 'p1',
      userId: 'u2',
      roleTag: 'Current Resident' as const,
      waterRating: 5,
      securityRating: 5,
      caretakerRating: 5,
      recommend: 'Yes' as const,
      comment: 'Excellent',
    }

    const result = await ReviewService.submitReview(payload)

    expect(result.id).toBe('r2')
    expect(result.rating).toBe(5)
  })
})
