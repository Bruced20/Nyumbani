'use server'

import { createClient } from '@/lib/supabase/server'
import { reviewSubmissionSchema, ReviewSubmissionInput } from '@/lib/validators'
import { handleValidationError, AppError } from '@/lib/utils/error-handler'
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
      logger.error('Supabase review insertion error:', error)
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
