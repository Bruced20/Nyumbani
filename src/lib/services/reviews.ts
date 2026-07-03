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
}
