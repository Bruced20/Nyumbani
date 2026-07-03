import { createStaticClient } from '../supabase/server'
import { KENYAN_LOCATIONS } from '@/lib/mock-data'

/**
 * Locations Repository.
 * Suggests matching locations based on search terms.
 */
export const LocationRepository = {
  async findSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return []

    try {
      const supabase = createStaticClient()
      const { data, error } = await supabase
        .from('properties')
        .select('neighborhood')
        .ilike('neighborhood', `%${query}%`)

      if (error) {
        throw error
      }

      // Extract unique neighborhoods from properties database rows
      const dbNeighborhoods = Array.from(
        new Set((data || []).map((p) => p.neighborhood.split(',')[0].trim()))
      )

      // Merge with static Kenyan locations list to ensure autocomplete coverage
      const staticHits = KENYAN_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      )

      const merged = Array.from(new Set([...dbNeighborhoods, ...staticHits])).slice(0, 8)
      return merged
    } catch {
      // Fail-safe fallback to static Kenyan locations in case of network issue
      const staticHits = KENYAN_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      )
      return staticHits.slice(0, 8)
    }
  },
}
