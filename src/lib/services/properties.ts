import { PropertyRepository } from '../repositories/properties'
import { ReviewRepository } from '../repositories/reviews'
import { mapProperty } from '../mappers'
import { Property } from '../mappers'
import { unstable_cache } from 'next/cache'
import { NotFoundError } from '../errors'
import { MOCK_PROPERTIES } from '../mock-data'
import { createAdminClient } from '../supabase/server'

/**
 * Properties Service Layer.
 * Interacts with PropertyRepository, applies business logic, maps results, and handles server-side caching.
 */
export const PropertyService = {
  /**
   * Safe Seeder. Inserts the 52 mock properties if the DB is blank.
   */
  async ensureSeeded(): Promise<void> {
    try {
      const admin = createAdminClient()
      const { count, error: countError } = await admin
        .from('properties')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      // If database properties count is 0, proceed to seed
      if (count === 0) {
        console.log('Database properties table is empty. Seeding 52 mock properties...')

        // 1. Seed review authors. One account per review role exists in auth.users
        // (created by migration 20260721000000); its profile is auto-created by the
        // on_auth_user_created trigger. reviews are unique(property_id, user_id), and
        // every property carries exactly one review per role, so keying the author by
        // role keeps all reviews insertable without weakening any constraint.
        const SEED_USER_BY_ROLE: Record<string, string> = {
          'Current Resident': '00000000-0000-0000-0000-000000000001',
          'Former Resident': '00000000-0000-0000-0000-000000000002',
          Neighbour: '00000000-0000-0000-0000-000000000003',
          'Community Contributor': '00000000-0000-0000-0000-000000000004',
        }

        // 2. Loop through all 52 mock properties and seed them
        for (const mock of MOCK_PROPERTIES) {
          // Insert main property row
          const { data: propRow, error: propErr } = await admin
            .from('properties')
            .insert({
              slug: mock.slug,
              name: mock.name,
              neighborhood: mock.neighborhood,
              latitude: mock.coordinates.lat,
              longitude: mock.coordinates.lng,
              county: 'Nairobi',
              rent_min: mock.rentMin,
              rent_max: mock.rentMax,
              house_type: mock.houseType,
              water_source: mock.waterSource,
              internet_providers:
                mock.internetType === 'Fiber Available'
                  ? ['Safaricom Fibre', 'Zuku']
                  : ['Mobile Internet'],
              security_details: `${mock.securityRating} security standard`,
              deposit_conditions: mock.deposit,
              parking_spaces: mock.parking,
              road_access: mock.roadType,
              public_transport_dist: mock.distanceFromRoad,
              health_score: mock.healthScore,
              is_verified: mock.isVerified,
            })
            .select('id')
            .single()

          if (propErr || !propRow) continue

          const propertyId = propRow.id

          // Insert associated images (sort_order preserves gallery sequence)
          const imagePayloads = mock.images.map((img, index) => ({
            property_id: propertyId,
            image_url: img,
            sort_order: index,
          }))
          const imgRes = await admin.from('property_images').insert(imagePayloads)
          if (imgRes.error)
            console.error(`Seed images failed for ${mock.slug}:`, imgRes.error.message)

          // Insert associated amenities
          const amenityPayloads = mock.amenities.map((amenity) => ({
            property_id: propertyId,
            amenity_name: amenity,
          }))
          const amRes = await admin.from('property_amenities').insert(amenityPayloads)
          if (amRes.error)
            console.error(`Seed amenities failed for ${mock.slug}:`, amRes.error.message)

          // Insert associated nearby places
          const nearbyPayloads = mock.nearbyPlaces.map((place) => ({
            property_id: propertyId,
            name: place.name,
            type: place.type,
            distance: place.distance,
          }))
          const npRes = await admin.from('nearby_places').insert(nearbyPayloads)
          if (npRes.error)
            console.error(`Seed nearby failed for ${mock.slug}:`, npRes.error.message)

          // Insert associated reviews, each authored by the seed account for its role.
          const reviewPayloads = mock.reviews.map((rev) => ({
            property_id: propertyId,
            user_id: SEED_USER_BY_ROLE[rev.role] ?? SEED_USER_BY_ROLE['Current Resident'],
            role_tag: rev.role,
            water_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
            security_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
            caretaker_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
            recommend: rev.rating >= 4.0 ? ('Yes' as const) : ('Maybe' as const),
            comment: rev.comment,
            is_moderated: false,
          }))
          const revRes = await admin.from('reviews').insert(reviewPayloads)
          if (revRes.error)
            console.error(`Seed reviews failed for ${mock.slug}:`, revRes.error.message)
        }
        console.log('Successfully seeded 52 properties into PostgreSQL via Admin client!')
      }
    } catch (err) {
      console.warn(
        'Self-seeding verification bypassed (database connection might be offline):',
        err
      )
    }
  },

  /**
   * Fetch featured properties. Cached using Next.js unstable_cache.
   */
  async getFeaturedProperties(): Promise<Property[]> {
    try {
      await this.ensureSeeded()

      const fetchFeatured = unstable_cache(
        async () => {
          // Pull a wider pool so the homepage hero (top 5) and the
          // "Recently reviewed" grid show distinct listings, not the same few.
          const rows = await PropertyRepository.findFeatured(9)
          const propertiesList: Property[] = []

          for (const row of rows) {
            const detail = await PropertyRepository.findBySlug(row.slug)
            if (detail) {
              const reviews = await ReviewRepository.findByPropertyId(row.id)
              propertiesList.push(
                mapProperty(row, detail.images, detail.amenities, detail.nearbyPlaces, reviews)
              )
            }
          }
          return propertiesList
        },
        ['featured-properties'],
        { revalidate: 3600, tags: ['properties', 'featured'] }
      )

      return await fetchFeatured()
    } catch (err) {
      console.warn('Supabase offline: falling back to static featured mock data', err)
      return MOCK_PROPERTIES.slice(0, 3) as unknown as Property[]
    }
  },

  /**
   * Fetch detailed property information by its slug.
   */
  async getPropertyBySlug(slug: string): Promise<Property> {
    try {
      await this.ensureSeeded()

      const fetchProperty = unstable_cache(
        async (s: string) => {
          const detail = await PropertyRepository.findBySlug(s)
          if (!detail) {
            throw new NotFoundError(`Property with slug "${s}" not found.`)
          }

          const reviews = await ReviewRepository.findByPropertyId(detail.property.id)
          return mapProperty(
            detail.property,
            detail.images,
            detail.amenities,
            detail.nearbyPlaces,
            reviews
          )
        },
        [`property-details-${slug}`],
        { revalidate: 3600, tags: ['properties', slug] }
      )

      return await fetchProperty(slug)
    } catch (err) {
      console.warn(`Supabase offline: falling back to static mock data for slug "${slug}"`, err)
      const mockProp = MOCK_PROPERTIES.find((p) => p.slug === slug)
      if (!mockProp) {
        throw new NotFoundError(`Property with slug "${slug}" not found in mock data either.`)
      }
      return mockProp as unknown as Property
    }
  },

  /**
   * Fetch similar properties nearby.
   */
  async getNearbyProperties(neighborhood: string, currentSlug: string): Promise<Property[]> {
    try {
      await this.ensureSeeded()

      const fetchNearby = unstable_cache(
        async (hood: string) => {
          const rows = await PropertyRepository.findNearby(hood, 4)
          const filtered = rows.filter((r) => r.slug !== currentSlug).slice(0, 3)
          const list: Property[] = []

          for (const row of filtered) {
            const detail = await PropertyRepository.findBySlug(row.slug)
            if (detail) {
              const reviews = await ReviewRepository.findByPropertyId(row.id)
              list.push(
                mapProperty(row, detail.images, detail.amenities, detail.nearbyPlaces, reviews)
              )
            }
          }
          return list
        },
        [`nearby-${neighborhood}-${currentSlug}`],
        { revalidate: 3600, tags: ['properties', 'nearby', neighborhood] }
      )

      return await fetchNearby(neighborhood)
    } catch (err) {
      console.warn('Supabase offline: falling back to static nearby mock properties', err)
      const similar = MOCK_PROPERTIES.filter(
        (p) => p.slug !== currentSlug && p.neighborhood.split(',')[0] === neighborhood.split(',')[0]
      ).slice(0, 3)
      return similar as unknown as Property[]
    }
  },

  /**
   * Batch-resolve full property details for a set of slugs (e.g. localStorage
   * saved-properties list). Missing/unknown slugs are silently skipped.
   */
  async getBySlugs(slugs: string[]): Promise<Property[]> {
    const results: Property[] = []
    for (const slug of slugs) {
      try {
        results.push(await this.getPropertyBySlug(slug))
      } catch {
        // slug no longer exists — skip it
      }
    }
    return results
  },

  /**
   * Fetch lightweight listing entries to optimize search/autocomplete dropdowns.
   */
  async getAllPropertiesBrief(): Promise<
    { id: string; slug: string; name: string; neighborhood: string }[]
  > {
    try {
      const rows = await PropertyRepository.findAll()
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        neighborhood: r.neighborhood,
      }))
    } catch {
      return MOCK_PROPERTIES.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        neighborhood: p.neighborhood,
      }))
    }
  },

  /**
   * Compute real platform aggregates for the homepage trust band.
   * Every number is derived from the actual property pool — never a literal —
   * so the trust metrics can never overstate the platform. Reviews are summed
   * from each property's real reviewCount. Neighborhoods are counted by their
   * first segment (e.g. "Kilimani, Nairobi" → "Kilimani").
   */
  async getPlatformStats(): Promise<{
    totalProperties: number
    verifiedProperties: number
    neighborhoods: number
    totalReviews: number
  }> {
    const reduce = (list: { isVerified: boolean; neighborhood: string; reviewCount: number }[]) => {
      const hoods = new Set(list.map((p) => p.neighborhood.split(',')[0].trim()))
      return {
        totalProperties: list.length,
        verifiedProperties: list.filter((p) => p.isVerified).length,
        neighborhoods: hoods.size,
        totalReviews: list.reduce((sum, p) => sum + (p.reviewCount || 0), 0),
      }
    }

    try {
      await this.ensureSeeded()

      const fetchStats = unstable_cache(
        async () => {
          const rows = await PropertyRepository.findAll()
          const list = await Promise.all(
            rows.map(async (row) => {
              const reviews = await ReviewRepository.findByPropertyId(row.id)
              return {
                isVerified: !!row.is_verified,
                neighborhood: row.neighborhood,
                reviewCount: reviews.length,
              }
            })
          )
          return reduce(list)
        },
        ['platform-stats'],
        { revalidate: 3600, tags: ['properties'] }
      )

      return await fetchStats()
    } catch (err) {
      console.warn('Supabase offline: computing platform stats from mock data', err)
      return reduce(
        MOCK_PROPERTIES.map((p) => ({
          isVerified: p.isVerified,
          neighborhood: p.neighborhood,
          reviewCount: p.reviewCount,
        }))
      )
    }
  },
}
