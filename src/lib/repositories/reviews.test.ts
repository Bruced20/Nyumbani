import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ReviewRepository } from './reviews'
import { createStaticClient, createClient } from '../supabase/server'

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

describe('ReviewRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch only unmoderated reviews for a property in descending order', async () => {
    const mockReviews = [
      {
        id: 'r1',
        property_id: 'p1',
        user_id: 'u1',
        role_tag: 'Current Resident',
        is_moderated: false,
      },
      {
        id: 'r2',
        property_id: 'p1',
        user_id: 'u2',
        role_tag: 'Former Resident',
        is_moderated: false,
      },
    ]

    const client = createStaticClient()

    // Mock the chain builder
    const eqMock1 = vi.fn().mockReturnThis()
    const eqMock2 = vi.fn().mockReturnThis()
    const orderMock = vi.fn().mockResolvedValue({ data: mockReviews, error: null })

    vi.mocked(client.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: eqMock1.mockReturnValue({
          eq: eqMock2.mockReturnValue({
            order: orderMock,
          }),
        }),
      }),
    } as unknown as ReturnType<typeof client.from>)

    const result = await ReviewRepository.findByPropertyId('p1')

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('r1')
    expect(eqMock1).toHaveBeenCalledWith('property_id', 'p1')
    expect(eqMock2).toHaveBeenCalledWith('is_moderated', false)
  })

  it('should insert a new review record', async () => {
    const mockReviewRow = { id: 'r9', property_id: 'p1', comment: 'Excellent' }
    const client = await createClient()

    vi.mocked(client.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockReviewRow, error: null }),
        }),
      }),
    } as unknown as ReturnType<typeof client.from>)

    const payload = {
      property_id: 'p1',
      user_id: 'u1',
      role_tag: 'Current Resident' as const,
      water_rating: 5,
      security_rating: 4,
      caretaker_rating: 5,
      recommend: 'Yes' as const,
      comment: 'Excellent',
    }

    const result = await ReviewRepository.create(payload)
    expect(result.id).toBe('r9')
    expect(result.comment).toBe('Excellent')
  })
})
