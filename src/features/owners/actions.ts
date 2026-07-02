'use server'

import { createClient } from '@/lib/supabase/server'
import { claimSubmissionSchema, ClaimSubmissionInput } from '@/lib/validators'
import { handleValidationError, AppError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/utils/logger'

/**
 * Server Action: Submits a verification claim for property ownership.
 */
export async function submitClaim(data: ClaimSubmissionInput) {
  try {
    logger.info('Received property ownership claim request', { propertyId: data.property_id })

    // 1. Validate inputs via Zod
    const validated = claimSubmissionSchema.parse(data)

    // 2. Fetch authenticated Supabase client
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AppError(
        'Authentication required to submit an ownership claim.',
        'UNAUTHORIZED',
        401
      )
    }

    // 3. Create claim record inside Supabase claims table
    const { data: claim, error } = await supabase
      .from('claims')
      .insert({
        property_id: validated.property_id,
        user_id: user.id,
        document_url: validated.document_url,
        status: 'Pending',
      })
      .select('id')
      .single()

    if (error) {
      logger.error('Supabase claim insertion error:', error)
      throw new AppError('Failed to record your ownership claim.', 'DATABASE_ERROR', 500)
    }

    logger.info('Ownership claim registered successfully', { claimId: claim.id })
    return {
      success: true as const,
      claimId: claim.id,
    }
  } catch (error) {
    return handleValidationError(error)
  }
}
