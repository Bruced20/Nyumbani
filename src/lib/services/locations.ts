import { LocationRepository } from '../repositories/locations'

/**
 * Locations Service.
 * Resolves location autocomplete recommendations.
 */
export const LocationService = {
  async getSuggestions(query: string): Promise<string[]> {
    if (!query || !query.trim()) return []
    return LocationRepository.findSuggestions(query.trim())
  },
}
