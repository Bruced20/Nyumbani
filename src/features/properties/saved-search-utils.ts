import type { FilterState } from './search-filters'

/**
 * Default filter values — used to detect which filters are "active" (non-default)
 * so we can label a saved search meaningfully.
 */
export const DEFAULT_FILTERS: FilterState = {
  rentMin: 0,
  rentMax: 150000,
  neighborhood: '',
  houseType: '',
  waterRating: '',
  electricityRating: '',
  internetType: '',
  securityRating: '',
  parking: '',
  roadType: '',
  garbageReliability: '',
  verifiedOnly: false,
  communityListedOnly: false,
  vacancyOnly: false,
  recentlyUpdated: false,
}

/** True when at least one filter differs from its default. */
export function hasActiveFilters(f: FilterState): boolean {
  return describeFilters(f).length > 0
}

/**
 * Build a short human label describing the active filters, e.g.
 * "Kilimani · One Bedroom · KES 0–40k · Verified". Pure and unit-tested.
 * Returns "" when nothing is active.
 */
export function describeFilters(f: FilterState): string {
  const parts: string[] = []

  if (f.neighborhood) parts.push(f.neighborhood)
  if (f.houseType) parts.push(f.houseType)

  if (f.rentMin > DEFAULT_FILTERS.rentMin || f.rentMax < DEFAULT_FILTERS.rentMax) {
    const min = f.rentMin > 0 ? `${f.rentMin / 1000}k` : '0'
    const max = f.rentMax < DEFAULT_FILTERS.rentMax ? `${f.rentMax / 1000}k` : '150k'
    parts.push(`KES ${min}–${max}`)
  }

  if (f.waterRating) parts.push(`Water: ${f.waterRating}`)
  if (f.electricityRating) parts.push(`Power: ${f.electricityRating}`)
  if (f.internetType) parts.push(f.internetType.split(' ')[0])
  if (f.securityRating) parts.push(`Security: ${f.securityRating}`)
  if (f.parking) parts.push(`Parking: ${f.parking}`)
  if (f.roadType) parts.push(`Road: ${f.roadType}`)
  if (f.garbageReliability) parts.push(`Garbage: ${f.garbageReliability}`)
  if (f.verifiedOnly) parts.push('Verified')
  if (f.communityListedOnly) parts.push('Community')
  if (f.vacancyOnly) parts.push('Vacancy')
  if (f.recentlyUpdated) parts.push('Recent')

  return parts.join(' · ')
}

/** A stable signature for de-duplicating saved searches. */
export function filtersSignature(f: FilterState): string {
  return JSON.stringify([
    f.rentMin,
    f.rentMax,
    f.neighborhood,
    f.houseType,
    f.waterRating,
    f.electricityRating,
    f.internetType,
    f.securityRating,
    f.parking,
    f.roadType,
    f.garbageReliability,
    f.verifiedOnly,
    f.communityListedOnly,
    f.vacancyOnly,
    f.recentlyUpdated,
  ])
}
