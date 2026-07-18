import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ReportService } from './reports'
import { ReportRepository } from '../repositories/reports'
import { AuditRepository } from '../repositories/audit'
import { Database } from '@/types/database.types'

vi.mock('../repositories/reports', () => ({
  ReportRepository: { create: vi.fn() },
}))

vi.mock('../repositories/audit', () => ({
  AuditRepository: { record: vi.fn() },
}))

type ReportRow = Database['public']['Tables']['reports']['Row']

describe('ReportService.submitReport', () => {
  beforeEach(() => vi.clearAllMocks())

  const row: ReportRow = {
    id: 'rep1',
    review_id: 'rev1',
    reporter_id: 'user1',
    reason: 'Spam or advertising',
    is_resolved: false,
    created_at: '2026-07-18T00:00:00Z',
  }

  it('creates a report and maps it to the domain shape', async () => {
    vi.mocked(ReportRepository.create).mockResolvedValue(row)
    vi.mocked(AuditRepository.record).mockResolvedValue()

    const result = await ReportService.submitReport({
      reviewId: 'rev1',
      reporterId: 'user1',
      reason: 'Spam or advertising',
    })

    expect(ReportRepository.create).toHaveBeenCalledWith({
      review_id: 'rev1',
      reporter_id: 'user1',
      reason: 'Spam or advertising',
    })
    expect(result).toEqual({
      id: 'rep1',
      reviewId: 'rev1',
      reporterId: 'user1',
      reason: 'Spam or advertising',
      isResolved: false,
      createdAt: '2026-07-18T00:00:00Z',
    })
  })

  it('still returns the report if the audit write fails', async () => {
    vi.mocked(ReportRepository.create).mockResolvedValue(row)
    vi.mocked(AuditRepository.record).mockRejectedValue(new Error('audit down'))

    const result = await ReportService.submitReport({
      reviewId: 'rev1',
      reporterId: 'user1',
      reason: 'Spam or advertising',
    })

    expect(result.id).toBe('rep1')
  })
})
