import { vi, describe, it, expect, beforeEach } from 'vitest'
import { requireAdmin } from './require-admin'
import { AuthorizationError } from '../errors'

const mockGetUser = vi.fn()
const mockSingle = vi.fn()

vi.mock('../supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockSingle,
        }),
      }),
    }),
  }),
}))

describe('requireAdmin', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the user id for an admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin1' } }, error: null })
    mockSingle.mockResolvedValue({ data: { role: 'Admin' }, error: null })
    await expect(requireAdmin()).resolves.toEqual({ id: 'admin1' })
  })

  it('rejects an unauthenticated caller', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError)
  })

  it('rejects a non-admin role', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'renter1' } }, error: null })
    mockSingle.mockResolvedValue({ data: { role: 'Renter' }, error: null })
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError)
  })

  it('rejects when the profile is missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'ghost' } }, error: null })
    mockSingle.mockResolvedValue({ data: null, error: null })
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError)
  })
})
