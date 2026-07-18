import { createClient, createStaticClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError, DuplicateError, PG_UNIQUE_VIOLATION } from '../errors'

type ReviewVoteRow = Database['public']['Tables']['review_votes']['Row']

/**
 * Review Votes ("Helpful") Repository.
 * One row per (review_id, user_id); the aggregate count is COUNT(*) grouped by
 * review. Vote counts are a public trust signal (readable by anyone via RLS);
 * a user may only create/delete their own vote.
 */
export const ReviewVoteRepository = {
  /** Number of helpful votes for a single review. */
  async countForReview(reviewId: string): Promise<number> {
    const supabase = createStaticClient()
    const { count, error } = await supabase
      .from('review_votes')
      .select('*', { count: 'exact', head: true })
      .eq('review_id', reviewId)

    if (error) {
      throw new DatabaseError('Failed to count review votes.', { rawError: error })
    }
    return count ?? 0
  },

  /**
   * Helpful vote counts for many reviews at once, plus the set the given user
   * has already voted on. Returns a map of reviewId → count and a set of voted ids.
   */
  async summaryForReviews(
    reviewIds: string[],
    userId?: string
  ): Promise<{ counts: Record<string, number>; voted: Set<string> }> {
    const counts: Record<string, number> = {}
    const voted = new Set<string>()
    if (reviewIds.length === 0) return { counts, voted }

    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('review_votes')
      .select('review_id, user_id')
      .in('review_id', reviewIds)

    if (error) {
      throw new DatabaseError('Failed to summarize review votes.', { rawError: error })
    }

    for (const row of data || []) {
      counts[row.review_id] = (counts[row.review_id] || 0) + 1
      if (userId && row.user_id === userId) voted.add(row.review_id)
    }
    return { counts, voted }
  },

  async create(reviewId: string, userId: string): Promise<ReviewVoteRow> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('review_votes')
      .insert({ review_id: reviewId, user_id: userId })
      .select('*')
      .single()

    if (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new DuplicateError('You have already marked this review helpful.')
      }
      throw new DatabaseError('Failed to record helpful vote.', { rawError: error })
    }
    return data
  },

  async delete(reviewId: string, userId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('review_votes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', userId)

    if (error) {
      throw new DatabaseError('Failed to remove helpful vote.', { rawError: error })
    }
  },
}
