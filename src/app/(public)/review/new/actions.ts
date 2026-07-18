'use server'

import { createClient } from '@/lib/supabase/server'
import { ReviewService } from '@/lib/services/reviews'
import { reviewSubmissionSchema, sanitizeComment } from '@/lib/validators'
import { DuplicateError } from '@/lib/errors'
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

interface SubmitReviewResult {
  success: boolean
  error?: string
  /** True when the user has already reviewed this property (unique violation). */
  alreadyReviewed?: boolean
  review?: Awaited<ReturnType<typeof ReviewService.submitReview>>
}

/**
 * Server Action for review submissions.
 * Validates the session AND the payload server-side (the client cannot be
 * trusted), sanitizes free text, and surfaces duplicate reviews gracefully.
 */
export async function submitReviewAction(input: SubmitReviewInput): Promise<SubmitReviewResult> {
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

    // Server-side validation — never trust the wizard's client state.
    const parsed = reviewSubmissionSchema.safeParse({
      property_id: input.propertyId,
      role_tag: input.roleTag,
      water_rating: input.waterRating,
      security_rating: input.securityRating,
      caretaker_rating: input.caretakerRating,
      recommend: input.recommend,
      comment: input.comment,
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid review data.' }
    }

    const cleanComment = sanitizeComment(parsed.data.comment ?? '')

    logger.info('submitReviewAction: Submitting anonymized review...', {
      userId: user.id,
      propertyId: parsed.data.property_id,
    })

    const review = await ReviewService.submitReview({
      propertyId: parsed.data.property_id,
      userId: user.id,
      roleTag: parsed.data.role_tag,
      waterRating: parsed.data.water_rating,
      securityRating: parsed.data.security_rating,
      caretakerRating: parsed.data.caretaker_rating,
      recommend: parsed.data.recommend,
      comment: cleanComment,
    })

    return { success: true, review }
  } catch (err) {
    if (err instanceof DuplicateError) {
      return {
        success: false,
        alreadyReviewed: true,
        error: 'You have already reviewed this property.',
      }
    }
    logger.error('submitReviewAction: Failed to submit review.', {
      error: err instanceof Error ? err.message : err,
    })
    return { success: false, error: 'An internal error occurred during review submission.' }
  }
}
