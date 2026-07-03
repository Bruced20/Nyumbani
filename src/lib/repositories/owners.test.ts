import { vi, describe, it, expect, beforeEach } from 'vitest'
import { OwnerRepository } from './owners'
import { createStaticClient } from '../supabase/server'

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

describe('OwnerRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should find claims by property id', async () => {
    const mockClaimsList = [{ id: 'c1', property_id: 'p1', user_id: 'u1', status: 'Pending' }]

    const client = createStaticClient()
    vi.mocked(client.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockClaimsList, error: null }),
      }),
    } as unknown as ReturnType<typeof client.from>)

    const result = await OwnerRepository.findByPropertyId('p1')
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('Pending')
  })
})
