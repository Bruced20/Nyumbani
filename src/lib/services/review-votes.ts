import { ReviewVoteRepository } from '../repositories/review-votes'

/**
 * Review Votes ("Helpful") Service.
 * Toggling is idempotent from the caller's view: `setVote(reviewId, userId, on)`
 * ensures the vote exists or not, and returns the fresh aggregate count.
 */
export const ReviewVoteService = {
  async summaryForReviews(reviewIds: string[], userId?: string) {
    return ReviewVoteRepository.summaryForReviews(reviewIds, userId)
  },

  /**
   * Ensure a user's helpful vote is on/off, then return the new count.
   * Create/delete are guarded so re-casting or re-removing is harmless.
   */
  async setVote(
    reviewId: string,
    userId: string,
    on: boolean
  ): Promise<{ count: number; voted: boolean }> {
    if (on) {
      try {
        await ReviewVoteRepository.create(reviewId, userId)
      } catch (err) {
        // A duplicate means the vote already exists — treat as success.
        if (!(err instanceof Error && err.name === 'DuplicateError')) throw err
      }
    } else {
      await ReviewVoteRepository.delete(reviewId, userId)
    }

    const count = await ReviewVoteRepository.countForReview(reviewId)
    return { count, voted: on }
  },
}
