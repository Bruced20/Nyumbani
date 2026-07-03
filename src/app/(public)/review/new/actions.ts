'use server'

import { createClient } from '@/lib/supabase/server'
import { ReviewService } from '@/lib/services/reviews'
import { logger } from '@/lib/utils/logger'

interface SubmitReviewInput {
  propertyId: string
  waterRating: number
  securityRating: number
  caretakerRating: number
  recommend: 'Yes' | 'No' | 'Maybe'
  comment: string
  roleTag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
}

/**
 * Server Action for review submissions.
 * Validates session context on the server side prior to database insertions.
 */
export async function submitReviewAction(input: SubmitReviewInput) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required. Please sign in to submit a review.',
      }
    }

    logger.info('submitReviewAction: Submitting anonymized review...', {
      userId: user.id,
      propertyId: input.propertyId,
    })

    const review = await ReviewService.submitReview({
      propertyId: input.propertyId,
      userId: user.id,
      roleTag: input.roleTag,
      waterRating: input.waterRating,
      securityRating: input.securityRating,
      caretakerRating: input.caretakerRating,
      recommend: input.recommend,
      comment: input.comment,
    })

    return { success: true, review }
  } catch (err) {
    logger.error('submitReviewAction: Failed to submit review.', {
      error: err instanceof Error ? err.message : err,
    })
    return { success: false, error: 'An internal error occurred during review submission.' }
  }
}
