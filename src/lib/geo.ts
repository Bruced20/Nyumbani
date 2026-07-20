/**
 * Nairobi neighbourhood centroids and small geo helpers.
 * Single source of truth for location fallbacks: used to seed mock data, to
 * place legacy rows that predate real coordinates, and by duplicate detection.
 * Real coordinates always come from the upload map pin and are never
 * regenerated from text.
 */

export const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  Westlands: { lat: -1.2682, lng: 36.8041 },
  Kilimani: { lat: -1.2908, lng: 36.7828 },
  Kileleshwa: { lat: -1.2789, lng: 36.7766 },
  Lavington: { lat: -1.2858, lng: 36.7645 },
  'South B': { lat: -1.3105, lng: 36.8373 },
  'South C': { lat: -1.3214, lng: 36.8285 },
  "Lang'ata": { lat: -1.3255, lng: 36.7823 },
  Karen: { lat: -1.3201, lng: 36.7029 },
  Embakasi: { lat: -1.3197, lng: 36.9028 },
  Pipeline: { lat: -1.3175, lng: 36.892 },
  Roysambu: { lat: -1.2189, lng: 36.8885 },
  Kasarani: { lat: -1.2201, lng: 36.8992 },
  Zimmerman: { lat: -1.2114, lng: 36.8912 },
  Ruaka: { lat: -1.2065, lng: 36.7788 },
  Ruiru: { lat: -1.1492, lng: 36.9582 },
  Kikuyu: { lat: -1.2541, lng: 36.6817 },
  Syokimau: { lat: -1.3524, lng: 36.9381 },
  Mlolongo: { lat: -1.3934, lng: 36.9248 },
  Utawala: { lat: -1.2801, lng: 36.9744 },
  'Thika Road': { lat: -1.2255, lng: 36.879 },
}

const NAIROBI_CENTER = { lat: -1.2864, lng: 36.8172 }

/**
 * Deterministic jitter of roughly 20 to 250 meters, seeded from a string, so
 * legacy rows in the same neighbourhood spread out realistically instead of
 * stacking on the centroid. Same input always gives the same point.
 */
export function jitteredCoords(
  neighborhood: string,
  seedText: string
): { lat: number; lng: number } {
  const key = neighborhood.split(',')[0].trim()
  const base = NEIGHBORHOOD_COORDS[key] ?? NAIROBI_CENTER

  let hash = 0
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0
  }
  // Two independent offsets in the range [-0.00225, +0.00225] degrees (~250m).
  const latOffset = (((hash % 1000) / 1000) * 2 - 1) * 0.00225
  const lngOffset = ((((hash >> 10) % 1000) / 1000) * 2 - 1) * 0.00225

  return { lat: base.lat + latOffset, lng: base.lng + lngOffset }
}

/** Great-circle distance in meters between two coordinate pairs. */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Normalize a property name for duplicate comparison. */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
