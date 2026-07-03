import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthRepository } from './auth'
import { createClient } from '../supabase/server'

vi.mock('../supabase/server', () => {
  const mockGetUser = vi.fn()
  const mockSignOut = vi.fn()
  const mockClient = {
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
  }
  return {
    createStaticClient: () => mockClient,
    createClient: () => mockClient,
  }
})

describe('AuthRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return user session details when authenticated', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' }
    const client = await createClient()
    vi.mocked(client.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    } as unknown as Awaited<ReturnType<typeof client.auth.getUser>>)

    const result = await AuthRepository.getUser()
    expect(result).not.toBeNull()
    expect(result?.id).toBe('user123')
  })

  it('should return null if user fetch fails or session is expired', async () => {
    const client = await createClient()
    vi.mocked(client.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: { message: 'Session expired', name: 'AuthError', status: 400 },
    } as unknown as Awaited<ReturnType<typeof client.auth.getUser>>)

    const result = await AuthRepository.getUser()
    expect(result).toBeNull()
  })
})
