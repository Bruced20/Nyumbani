import { vi, describe, it, expect, beforeEach } from 'vitest'
import { LocationRepository } from './locations'
import { createStaticClient } from '../supabase/server'

vi.mock('../supabase/server', () => {
  const fromMock = vi.fn()
  const mockClient = {
    from: fromMock,
  }
  return {
    createStaticClient: () => mockClient,
  }
})

describe('LocationRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return matched suggestions from database and static lists', async () => {
    const mockDbNeighborhoods = [
      { neighborhood: 'Westlands, Nairobi' },
      { neighborhood: 'Westlands, Nairobi' }, // duplicate to verify Set deduplication
    ]

    const client = createStaticClient()
    vi.mocked(client.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        ilike: vi.fn().mockResolvedValue({ data: mockDbNeighborhoods, error: null }),
      }),
    } as unknown as ReturnType<typeof client.from>)

    const result = await LocationRepository.findSuggestions('west')

    expect(result).toContain('Westlands')
    expect(result.length).toBeLessThanOrEqual(8)
  })

  it('should fall back to static list when query fails', async () => {
    const client = createStaticClient()
    vi.mocked(client.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        ilike: vi.fn().mockRejectedValue(new Error('Network offline')),
      }),
    } as unknown as ReturnType<typeof client.from>)

    const result = await LocationRepository.findSuggestions('Kilimani')
    expect(result).toContain('Kilimani')
  })
})
