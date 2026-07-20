'use server'

import { createClient } from '@/lib/supabase/server'
import { propertyCreateSchema, PropertyCreateInput } from '@/lib/validators'
import { handleValidationError, AppError } from '@/lib/utils/error-handler'
import { distanceMeters, normalizeName } from '@/lib/geo'
import { logger } from '@/lib/utils/logger'
import { revalidatePath } from 'next/cache'

export interface PossibleDuplicate {
  slug: string
  name: string
  neighborhood: string
  distanceM: number
}

/**
 * Duplicate detection: a submission likely matches an existing property when
 * the normalized name matches AND the pin is within ~150m. Application-level
 * by design, so the user gets a friendly confirmation instead of a database
 * error, and can continue anyway for genuine same-name buildings.
 */
async function findPossibleDuplicates(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  lat: number,
  lng: number
): Promise<PossibleDuplicate[]> {
  const { data } = await supabase
    .from('properties')
    .select('slug, name, neighborhood, latitude, longitude')
    // Cheap bounding box first; precise distance check below.
    .gte('latitude', lat - 0.01)
    .lte('latitude', lat + 0.01)
    .gte('longitude', lng - 0.01)
    .lte('longitude', lng + 0.01)

  const target = normalizeName(name)
  return (data || [])
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      neighborhood: p.neighborhood,
      distanceM: Math.round(
        distanceMeters({ lat, lng }, { lat: p.latitude as number, lng: p.longitude as number })
      ),
    }))
    .filter((p) => p.distanceM <= 150 && normalizeName(p.name) === target)
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, 3)
}

/**
 * Server Action: Creates a new community-submitted property listing.
 * Any signed-in user can submit; the listing starts unverified (community
 * submitted) until an owner claims it. Pass allowDuplicate=true to proceed
 * after the user has confirmed a near-match is a different property.
 */
export async function createProperty(data: PropertyCreateInput, allowDuplicate = false) {
  try {
    logger.info('Received property creation request', { name: data.name })

    const validated = propertyCreateSchema.parse(data)

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AppError('Authentication required to submit a property.', 'UNAUTHORIZED', 401)
    }

    // Duplicate check before insert, unless the user already confirmed.
    if (!allowDuplicate) {
      const duplicates = await findPossibleDuplicates(
        supabase,
        validated.name,
        validated.latitude,
        validated.longitude
      )
      if (duplicates.length > 0) {
        return { success: false as const, possibleDuplicates: duplicates }
      }
    }

    const baseSlug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`

    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        name: validated.name,
        address: validated.address ?? null,
        neighborhood: validated.neighborhood,
        rent_min: validated.rent_min,
        rent_max: validated.rent_max,
        house_type: validated.house_type,
        water_source: validated.water_source,
        internet_providers: validated.internet_providers,
        security_details: validated.security_details,
        deposit_conditions: validated.deposit_conditions,
        parking_spaces: validated.parking_spaces,
        road_access: validated.road_access,
        public_transport_dist: validated.public_transport_dist,
        latitude: validated.latitude,
        longitude: validated.longitude,
        county: 'Nairobi',
        estate: validated.estate ?? null,
        street: validated.street ?? null,
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
      throw new AppError('Failed to save the property listing.', 'DATABASE_ERROR', 500)
    }

    logger.info('Property listing created successfully', { slug: property.slug })

    revalidatePath('/search')

    return {
      success: true as const,
      slug: property.slug,
    }
  } catch (error) {
    return handleValidationError(error)
  }
}
