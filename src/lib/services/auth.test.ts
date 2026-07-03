import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthService } from './auth'
import { AuthRepository } from '../repositories/auth'
import { ProfileRepository } from '../repositories/profiles'
import { User } from '@supabase/supabase-js'

vi.mock('../repositories/auth', () => ({
  AuthRepository: {
    getUser: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  },
}))

vi.mock('../repositories/profiles', () => ({
  ProfileRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return mapped Profile when authenticated user exists', async () => {
    const mockUser = { id: 'u1', email: 'test@example.com' }
    const mockProfileRow = {
      id: 'u1',
      email: 'test@example.com',
      full_name: 'Test Name',
      avatar_url: 'http://avatar',
      role: 'Renter' as const,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T00:00:00Z',
      last_login_at: '2026-07-01T00:00:00Z',
      provider: 'google',
    }

    vi.mocked(AuthRepository.getUser).mockResolvedValue(mockUser as unknown as User)
    vi.mocked(ProfileRepository.findById).mockResolvedValue(mockProfileRow)
    vi.mocked(ProfileRepository.update).mockResolvedValue(mockProfileRow)

    const result = await AuthService.getCurrentUser()
    expect(result).not.toBeNull()
    expect(result?.fullName).toBe('Test Name')
  })

  it('should create profile during sync if one does not exist', async () => {
    const mockUser = { id: 'u2', email: 'new@example.com', app_metadata: { provider: 'google' } }
    const mockNewProfile = {
      id: 'u2',
      email: 'new@example.com',
      full_name: 'New User',
      avatar_url: '',
      role: 'Renter' as const,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T00:00:00Z',
      last_login_at: '2026-07-01T00:00:00Z',
      provider: 'google',
    }

    vi.mocked(ProfileRepository.findById).mockResolvedValue(null)
    vi.mocked(ProfileRepository.create).mockResolvedValue(mockNewProfile)

    const result = await AuthService.syncUserProfile(mockUser)
    expect(result).not.toBeNull()
    expect(result.id).toBe('u2')
    expect(ProfileRepository.create).toHaveBeenCalled()
  })
})
