import { revalidateTag } from 'next/cache'

/**
 * Cache management and invalidation utilities.
 * Leverages Next.js revalidateTag to force fetch updates when reviews or properties change.
 */
export const CacheManager = {
  /**
   * Invalidates cached details for a specific property.
   */
  revalidateProperty(slug: string) {
    const revalidate = revalidateTag as unknown as (tag: string) => void
    // Clear details page cache
    revalidate(slug)
    // Clear search pool caches to ensure listings match
    revalidate('search-pool')
    revalidate('featured')
  },

  /**
   * Invalidates all properties and search pool caches globally.
   */
  revalidateAll() {
    const revalidate = revalidateTag as unknown as (tag: string) => void
    revalidate('properties')
    revalidate('search-pool')
    revalidate('featured')
  },
}
