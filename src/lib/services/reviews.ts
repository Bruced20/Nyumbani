import { ReviewRepository } from '../repositories/reviews'
import { mapReviewRow, Review } from '../mappers'
import { unstable_cache } from 'next/cache'

/**
 * Reviews Service.
 * Manages tenant reviews and ratings calculations.
 */
export const ReviewService = {
  async getReviewsByProperty(propertyId: string): Promise<Review[]> {
    const fetchReviews = unstable_cache(
      async (pid: string) => {
        const rows = await ReviewRepository.findByPropertyId(pid)
        return rows.map(mapReviewRow)
      },
      [`reviews-property-${propertyId}`],
      { revalidate: 3600, tags: ['reviews', propertyId] }
    )

    return fetchReviews(propertyId)
  },

  /**
   * Submits a new resident review to the database and invalidates local cache pools.
   */
  async submitReview(payload: {
    propertyId: string
    userId: string
    roleTag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
    waterRating: number
    securityRating: number
    caretakerRating: number
    recommend: 'Yes' | 'No' | 'Maybe'
    comment: string
  }): Promise<Review> {
    const row = await ReviewRepository.create({
      property_id: payload.propertyId,
      user_id: payload.userId,
      role_tag: payload.roleTag,
      water_rating: payload.waterRating,
      security_rating: payload.securityRating,
      caretaker_rating: payload.caretakerRating,
      recommend: payload.recommend,
      comment: payload.comment,
    })

    // Invalidate next cache entries
    try {
      const { revalidateTag } = await import('next/cache')
      const revalidate = revalidateTag as unknown as (tag: string) => void
      revalidate(payload.propertyId)
      revalidate('reviews')
    } catch {
      // ignore cache invalidation errors outside Next context (e.g. tests)
    }

    return mapReviewRow(row)
  },
}
