'use server'

import { createClient } from '@/lib/supabase/server'
import { propertyCreateSchema, PropertyCreateInput } from '@/lib/validators'
import { handleValidationError, AppError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/utils/logger'
import { revalidatePath } from 'next/cache'

/**
 * Server Action: Creates a new community-submitted property listing.
 */
export async function createProperty(data: PropertyCreateInput) {
  try {
    logger.info('Received property creation request', { name: data.name })

    // 1. Validate inputs via Zod
    const validated = propertyCreateSchema.parse(data)

    // 2. Fetch authenticated Supabase client
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AppError('Authentication required to submit a property.', 'UNAUTHORIZED', 401)
    }

    // 3. Generate unique slug from property name
    const baseSlug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`

    // 4. Insert property record into DB
    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        ...validated,
        slug: uniqueSlug,
        created_by: user.id,
        is_verified: false,
      })
      .select('slug')
      .single()

    if (error) {
      logger.error('Supabase property insertion error:', {
        rawError: error as unknown as Record<string, unknown>,
      })
      throw new AppError(
        'Failed to create property listing inside database.',
        'DATABASE_ERROR',
        500
      )
    }

    logger.info('Property listing created successfully', { slug: property.slug })

    // Invalidate search and listings paths
    revalidatePath('/search')

    return {
      success: true as const,
      slug: property.slug,
    }
  } catch (error) {
    return handleValidationError(error)
  }
}
