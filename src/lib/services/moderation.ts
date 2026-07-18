import { ModerationRepository } from '../repositories/moderation'
import { mapReviewRow, mapReportRow, mapClaimRow, Review, Report, OwnerClaim } from '../mappers'
import { logger } from '../utils/logger'

export interface FlaggedReview {
  review: Review
  reports: Report[]
  reportCount: number
  reasons: string[]
  propertyName: string
  propertySlug: string
}

export interface PendingClaimView {
  claim: OwnerClaim
  propertyName: string
  propertySlug: string
}

export interface ModerationQueues {
  flaggedReviews: FlaggedReview[]
  pendingClaims: PendingClaimView[]
}

/**
 * Moderation Service.
 * Assembles the admin queues and orchestrates the moderation workflows
 * (soft-hide/restore reviews, approve/reject claims). Every mutating method
 * writes an accountable moderation_logs entry. Reads degrade to empty queues
 * if the service-role backend is unavailable (local dev), never throwing into
 * the admin page.
 */
export const ModerationService = {
  async getQueues(): Promise<ModerationQueues> {
    try {
      const [reports, claims] = await Promise.all([
        ModerationRepository.listUnresolvedReports(),
        ModerationRepository.listPendingClaims(),
      ])

      // Group reports by review, then hydrate review + property context.
      const reportsByReview = new Map<string, typeof reports>()
      for (const r of reports) {
        const list = reportsByReview.get(r.review_id) || []
        list.push(r)
        reportsByReview.set(r.review_id, list)
      }

      const reviewIds = Array.from(reportsByReview.keys())
      const reviews = await ModerationRepository.listReviewsByIds(reviewIds)
      const reviewById = new Map(reviews.map((rev) => [rev.id, rev]))

      const flaggedReviews: FlaggedReview[] = []
      for (const [reviewId, group] of reportsByReview) {
        const reviewRow = reviewById.get(reviewId)
        if (!reviewRow) continue // review deleted; skip
        const { name, slug } = await this.propertyContext(reviewRow.property_id)
        flaggedReviews.push({
          review: mapReviewRow(reviewRow),
          reports: group.map(mapReportRow),
          reportCount: group.length,
          reasons: Array.from(new Set(group.map((g) => g.reason))),
          propertyName: name,
          propertySlug: slug,
        })
      }
      // Most-reported first.
      flaggedReviews.sort((a, b) => b.reportCount - a.reportCount)

      const pendingClaims: PendingClaimView[] = []
      for (const claim of claims) {
        const { name, slug } = await this.propertyContext(claim.property_id)
        pendingClaims.push({ claim: mapClaimRow(claim), propertyName: name, propertySlug: slug })
      }

      return { flaggedReviews, pendingClaims }
    } catch (err) {
      logger.warn('ModerationService.getQueues: backend unavailable, returning empty queues', {
        error: err instanceof Error ? err.message : err,
      })
      return { flaggedReviews: [], pendingClaims: [] }
    }
  },

  /** Best-effort property name/slug for display; falls back to the raw id. */
  async propertyContext(propertyId: string): Promise<{ name: string; slug: string }> {
    try {
      const brief = await ModerationRepository.getPropertyBrief(propertyId)
      if (brief) return brief
    } catch {
      // fall through
    }
    return { name: 'Unknown property', slug: '' }
  },

  /** Soft-hide a review: reversible, accountable, and resolves its reports. */
  async hideReview(reviewId: string, moderatorId: string, reason: string): Promise<Review> {
    const row = await ModerationRepository.setReviewModeration(reviewId, true, moderatorId, reason)
    await ModerationRepository.resolveReportsForReview(reviewId)
    await ModerationRepository.log({
      actor_id: moderatorId,
      action: 'review.hide',
      entity: 'review',
      entity_id: reviewId,
      reason,
    })
    return mapReviewRow(row)
  },

  /** Restore a previously hidden review. */
  async restoreReview(reviewId: string, moderatorId: string): Promise<Review> {
    const row = await ModerationRepository.setReviewModeration(reviewId, false, moderatorId, null)
    await ModerationRepository.log({
      actor_id: moderatorId,
      action: 'review.restore',
      entity: 'review',
      entity_id: reviewId,
    })
    return mapReviewRow(row)
  },

  /** Approve a landlord claim → mark property verified + record owner. */
  async approveClaim(claimId: string, moderatorId: string): Promise<OwnerClaim> {
    const claim = await ModerationRepository.setClaimStatus(claimId, 'Approved', null)
    await ModerationRepository.markPropertyVerified(claim.property_id, claim.user_id)
    await ModerationRepository.log({
      actor_id: moderatorId,
      action: 'claim.approve',
      entity: 'claim',
      entity_id: claimId,
      metadata: { property_id: claim.property_id, owner_id: claim.user_id },
    })
    return mapClaimRow(claim)
  },

  /** Reject a landlord claim with a reason. */
  async rejectClaim(claimId: string, moderatorId: string, reason: string): Promise<OwnerClaim> {
    const claim = await ModerationRepository.setClaimStatus(claimId, 'Rejected', reason)
    await ModerationRepository.log({
      actor_id: moderatorId,
      action: 'claim.reject',
      entity: 'claim',
      entity_id: claimId,
      reason,
    })
    return mapClaimRow(claim)
  },
}
