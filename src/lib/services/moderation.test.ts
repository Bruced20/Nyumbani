import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ModerationService } from './moderation'
import { ModerationRepository } from '../repositories/moderation'
import { Database } from '@/types/database.types'

vi.mock('../repositories/moderation', () => ({
  ModerationRepository: {
    listUnresolvedReports: vi.fn(),
    listReviewsByIds: vi.fn(),
    listPendingClaims: vi.fn(),
    getPropertyBrief: vi.fn(),
    setReviewModeration: vi.fn(),
    resolveReportsForReview: vi.fn(),
    setClaimStatus: vi.fn(),
    markPropertyVerified: vi.fn(),
    log: vi.fn(),
  },
}))

type ReviewRow = Database['public']['Tables']['reviews']['Row']
type ClaimRow = Database['public']['Tables']['claims']['Row']

const reviewRow: ReviewRow = {
  id: 'rev1',
  property_id: 'prop1',
  user_id: 'user1',
  role_tag: 'Current Resident',
  water_rating: 2,
  security_rating: 2,
  caretaker_rating: 2,
  recommend: 'No',
  comment: 'spammy text',
  is_moderated: false,
  moderated_at: null,
  moderated_by: null,
  moderation_reason: null,
  created_at: '2026-07-18T00:00:00Z',
  updated_at: '2026-07-18T00:00:00Z',
}

const claimRow: ClaimRow = {
  id: 'claim1',
  property_id: 'prop1',
  user_id: 'owner1',
  document_url: 'https://example.com/doc.pdf',
  status: 'Pending',
  rejection_reason: null,
  created_at: '2026-07-18T00:00:00Z',
  updated_at: '2026-07-18T00:00:00Z',
}

describe('ModerationService.getQueues', () => {
  beforeEach(() => vi.clearAllMocks())

  it('groups reports by review and sorts most-reported first', async () => {
    vi.mocked(ModerationRepository.listUnresolvedReports).mockResolvedValue([
      {
        id: 'rp1',
        review_id: 'rev1',
        reporter_id: 'a',
        reason: 'Spam or advertising',
        is_resolved: false,
        created_at: 't1',
      },
      {
        id: 'rp2',
        review_id: 'rev1',
        reporter_id: 'b',
        reason: 'False or misleading',
        is_resolved: false,
        created_at: 't2',
      },
      {
        id: 'rp3',
        review_id: 'rev2',
        reporter_id: 'c',
        reason: 'Spam or advertising',
        is_resolved: false,
        created_at: 't3',
      },
    ])
    vi.mocked(ModerationRepository.listReviewsByIds).mockResolvedValue([
      reviewRow,
      { ...reviewRow, id: 'rev2' },
    ])
    vi.mocked(ModerationRepository.listPendingClaims).mockResolvedValue([])
    vi.mocked(ModerationRepository.getPropertyBrief).mockResolvedValue({
      name: 'Sunrise',
      slug: 'sunrise',
    })

    const { flaggedReviews } = await ModerationService.getQueues()
    expect(flaggedReviews).toHaveLength(2)
    expect(flaggedReviews[0].review.id).toBe('rev1')
    expect(flaggedReviews[0].reportCount).toBe(2)
    expect(flaggedReviews[0].reasons).toContain('Spam or advertising')
    expect(flaggedReviews[0].reasons).toContain('False or misleading')
  })

  it('returns empty queues if the backend throws', async () => {
    vi.mocked(ModerationRepository.listUnresolvedReports).mockRejectedValue(new Error('no db'))
    const queues = await ModerationService.getQueues()
    expect(queues).toEqual({ flaggedReviews: [], pendingClaims: [] })
  })
})

describe('ModerationService mutations', () => {
  beforeEach(() => vi.clearAllMocks())

  it('hideReview updates state, resolves reports, and logs', async () => {
    vi.mocked(ModerationRepository.setReviewModeration).mockResolvedValue({
      ...reviewRow,
      is_moderated: true,
    })
    await ModerationService.hideReview('rev1', 'admin1', 'Spam')

    expect(ModerationRepository.setReviewModeration).toHaveBeenCalledWith(
      'rev1',
      true,
      'admin1',
      'Spam'
    )
    expect(ModerationRepository.resolveReportsForReview).toHaveBeenCalledWith('rev1')
    expect(ModerationRepository.log).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'review.hide', entity_id: 'rev1', actor_id: 'admin1' })
    )
  })

  it('restoreReview clears moderation and logs', async () => {
    vi.mocked(ModerationRepository.setReviewModeration).mockResolvedValue(reviewRow)
    await ModerationService.restoreReview('rev1', 'admin1')

    expect(ModerationRepository.setReviewModeration).toHaveBeenCalledWith(
      'rev1',
      false,
      'admin1',
      null
    )
    expect(ModerationRepository.log).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'review.restore' })
    )
  })

  it('approveClaim verifies the property and logs', async () => {
    vi.mocked(ModerationRepository.setClaimStatus).mockResolvedValue({
      ...claimRow,
      status: 'Approved',
    })
    await ModerationService.approveClaim('claim1', 'admin1')

    expect(ModerationRepository.setClaimStatus).toHaveBeenCalledWith('claim1', 'Approved', null)
    expect(ModerationRepository.markPropertyVerified).toHaveBeenCalledWith('prop1', 'owner1')
    expect(ModerationRepository.log).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'claim.approve' })
    )
  })

  it('rejectClaim records the reason and logs', async () => {
    vi.mocked(ModerationRepository.setClaimStatus).mockResolvedValue({
      ...claimRow,
      status: 'Rejected',
      rejection_reason: 'Blurry document',
    })
    await ModerationService.rejectClaim('claim1', 'admin1', 'Blurry document')

    expect(ModerationRepository.setClaimStatus).toHaveBeenCalledWith(
      'claim1',
      'Rejected',
      'Blurry document'
    )
    expect(ModerationRepository.markPropertyVerified).not.toHaveBeenCalled()
    expect(ModerationRepository.log).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'claim.reject', reason: 'Blurry document' })
    )
  })
})
