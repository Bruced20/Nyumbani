'use server'

import { createClient } from '@/lib/supabase/server'
import {
  reviewSubmissionSchema,
  reportSubmissionSchema,
  ReviewSubmissionInput,
} from '@/lib/validators'
import { handleValidationError, AppError } from '@/lib/utils/error-handler'
import { ReportService } from '@/lib/services/reports'
import { ReviewVoteService } from '@/lib/services/review-votes'
import { DuplicateError } from '@/lib/errors'
import { logger } from '@/lib/utils/logger'
import { revalidatePath } from 'next/cache'

/**
 * Server Action: Submits a new structured tenant review for a property.
 * Enforces authenticated session check and revalidates caching on the property route.
 */
export async function submitReview(data: ReviewSubmissionInput) {
  try {
    logger.info('Received review submission request', { propertyId: data.property_id })

    // 1. Validate inputs via Zod
    const validated = reviewSubmissionSchema.parse(data)

    // 2. Fetch authenticated Supabase client
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AppError('Authentication required to submit a review.', 'UNAUTHORIZED', 401)
    }

    // 3. Insert review record (RLS and DB constraints prevent duplicates)
    const { error } = await supabase.from('reviews').insert({
      property_id: validated.property_id,
      user_id: user.id,
      role_tag: validated.role_tag,
      water_rating: validated.water_rating,
      security_rating: validated.security_rating,
      caretaker_rating: validated.caretaker_rating,
      recommend: validated.recommend,
      comment: validated.comment || null,
      is_moderated: false,
    })

    if (error) {
      logger.error('Supabase review insertion error:', {
        rawError: error as unknown as Record<string, unknown>,
      })
      if (error.code === '23505') {
        throw new AppError(
          'You have already submitted a review for this property.',
          'DUPLICATE_REVIEW',
          409
        )
      }
      throw new AppError('Failed to save your review to the database.', 'DATABASE_ERROR', 500)
    }

    // 4. Fetch property slug to invalidate edge cache
    const { data: property } = await supabase
      .from('properties')
      .select('slug')
      .eq('id', validated.property_id)
      .single()

    if (property) {
      logger.info('Invalidating edge cache for property path', { slug: property.slug })
      revalidatePath(`/property/${property.slug}`)
    }

    logger.info('Review submitted successfully')
    return {
      success: true as const,
    }
  } catch (error) {
    return handleValidationError(error)
  }
}

/**
 * Server Action: File a moderation report against a review.
 * Auth-gated and validated; reports are private admin feedstock (RLS-enforced).
 */
export async function submitReportAction(input: {
  reviewId: string
  reason: string
  detail?: string
}): Promise<{ success: boolean; error?: string; alreadyReported?: boolean }> {
  try {
    const parsed = reportSubmissionSchema.safeParse({
      review_id: input.reviewId,
      reason: input.reason,
      detail: input.detail,
    })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid report.' }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Please sign in to report a review.' }
    }

    // Combine reason + optional detail into the stored reason text.
    const reason = parsed.data.detail
      ? `${parsed.data.reason}: ${parsed.data.detail}`
      : parsed.data.reason

    await ReportService.submitReport({
      reviewId: parsed.data.review_id,
      reporterId: user.id,
      reason,
    })

    return { success: true }
  } catch (err) {
    if (err instanceof DuplicateError) {
      return {
        success: false,
        alreadyReported: true,
        error: 'You have already reported this review.',
      }
    }
    logger.error('submitReportAction failed', { error: err instanceof Error ? err.message : err })
    return { success: false, error: 'Could not file the report. Please try again.' }
  }
}

/**
 * Server Action: Toggle the current user's "Helpful" vote on a review.
 * Returns the fresh aggregate count so the UI can reconcile optimistic state.
 */
export async function toggleHelpfulAction(input: {
  reviewId: string
  on: boolean
}): Promise<{ success: boolean; count?: number; voted?: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Please sign in to vote.' }
    }

    const { count, voted } = await ReviewVoteService.setVote(input.reviewId, user.id, input.on)
    return { success: true, count, voted }
  } catch (err) {
    logger.error('toggleHelpfulAction failed', { error: err instanceof Error ? err.message : err })
    return { success: false, error: 'Could not record your vote. Please try again.' }
  }
}

/**
 * Server Action: Read the current helpful-vote state for a review.
 * The count is public; `voted` reflects the signed-in user (false if anonymous).
 * Degrades to a zero/false state if the votes table is unavailable, so the UI
 * never breaks in local/offline development.
 */
export async function getHelpfulStateAction(
  reviewId: string
): Promise<{ count: number; voted: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { counts, voted } = await ReviewVoteService.summaryForReviews([reviewId], user?.id)
    return { count: counts[reviewId] ?? 0, voted: voted.has(reviewId) }
  } catch (err) {
    logger.warn('getHelpfulStateAction: votes unavailable, defaulting to zero', {
      error: err instanceof Error ? err.message : err,
    })
    return { count: 0, voted: false }
  }
}
