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

        // 1. Create a mock seeder profile
        const seederUserId = '00000000-0000-0000-0000-000000000000'
        await admin.from('profiles').upsert({
          id: seederUserId,
          email: 'seeder@nyumbani.co.ke',
          full_name: 'Nyumbani Community',
          role: 'Renter',
        })

        // 2. Loop through all 52 mock properties and seed them
        for (const mock of MOCK_PROPERTIES) {
          // Insert main property row
          const { data: propRow, error: propErr } = await admin
            .from('properties')
            .insert({
              slug: mock.slug,
              name: mock.name,
              neighborhood: mock.neighborhood,
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

          // Insert associated images
          const imagePayloads = mock.images.map((img) => ({
            property_id: propertyId,
            image_url: img,
          }))
          await admin.from('property_images').insert(imagePayloads)

          // Insert associated amenities
          const amenityPayloads = mock.amenities.map((amenity) => ({
            property_id: propertyId,
            amenity_name: amenity,
          }))
          await admin.from('property_amenities').insert(amenityPayloads)

          // Insert associated nearby places
          const nearbyPayloads = mock.nearbyPlaces.map((place) => ({
            property_id: propertyId,
            name: place.name,
            type: place.type,
            distance: place.distance,
          }))
          await admin.from('nearby_places').insert(nearbyPayloads)

          // Insert associated reviews
          const reviewPayloads = mock.reviews.map((rev) => ({
            property_id: propertyId,
            user_id: seederUserId,
            role_tag: rev.role,
            water_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
            security_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
            caretaker_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
            recommend: rev.rating >= 4.0 ? ('Yes' as const) : ('Maybe' as const),
            comment: rev.comment,
            is_moderated: false,
          }))
          await admin.from('reviews').insert(reviewPayloads)
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
          const rows = await PropertyRepository.findFeatured()
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
   * Fetch lightweight listing entries to optimize search/autocomplete dropdowns.
   */
  async getAllPropertiesBrief(): Promise<{ id: string; name: string; neighborhood: string }[]> {
    try {
      const rows = await PropertyRepository.findAll()
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        neighborhood: r.neighborhood,
      }))
    } catch {
      return MOCK_PROPERTIES.map((p) => ({
        id: p.id,
        name: p.name,
        neighborhood: p.neighborhood,
      }))
    }
  },
}
