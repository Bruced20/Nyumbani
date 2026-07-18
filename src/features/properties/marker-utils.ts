import type { Property } from '@/lib/mappers'

/**
 * A property may carry a dormant `isFeatured` flag for future monetization.
 * No data sets it today — the marker code path exists but never fabricates it.
 */
export type MapProperty = Property & { isFeatured?: boolean }

export type TrustTier = 'featured' | 'verified' | 'healthy' | 'standard'

/** Health score is on a 0–5 scale; "green/trusted" threshold is 4.5. */
export const HEALTHY_THRESHOLD = 4.5

/**
 * Format a monthly rent into a compact currency label.
 * 18000 → "KSh 18K", 120000 → "KSh 120K", 1200000 → "KSh 1.2M", 900 → "KSh 900".
 */
export function formatCompactKes(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return 'KSh —'
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000
    return `KSh ${trimZero(m)}M`
  }
  if (amount >= 1_000) {
    const k = amount / 1_000
    return `KSh ${trimZero(k)}K`
  }
  return `KSh ${Math.round(amount)}`
}

/** Drop a trailing ".0" but keep one decimal otherwise (1.2, 45, 120). */
function trimZero(n: number): string {
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

/**
 * Classify a property's trust tier for its map marker outline.
 * Priority (first match wins): featured → verified → healthy (≥4.5) → standard.
 * This lets users spot the most trustworthy home, not just the cheapest.
 */
export function markerTrustTier(property: MapProperty): TrustTier {
  if (property.isFeatured) return 'featured'
  if (property.isVerified) return 'verified'
  if (property.healthScore >= HEALTHY_THRESHOLD) return 'healthy'
  return 'standard'
}

/**
 * Outline + accent classes per tier. Uses semantic tokens so it adapts to dark
 * mode; the gold featured tier is intentionally the only literal color (brand
 * monetization accent, no token yet).
 */
export function trustOutlineClass(tier: TrustTier): string {
  switch (tier) {
    case 'featured':
      return 'ring-2 ring-amber-400 border-amber-400'
    case 'verified':
      return 'ring-2 ring-blue-500 border-blue-500'
    case 'healthy':
      return 'ring-2 ring-status-success border-status-success'
    case 'standard':
    default:
      return 'ring-1 ring-border-subtle border-border-subtle'
  }
}

/**
 * Hex outline color per tier, for the Leaflet divIcon (built as an HTML string,
 * so it can't use Tailwind classes — mirrors trustOutlineClass intent).
 */
export function trustOutlineHex(tier: TrustTier): string {
  switch (tier) {
    case 'featured':
      return '#f59e0b'
    case 'verified':
      return '#3b82f6'
    case 'healthy':
      return '#3f7d58'
    case 'standard':
    default:
      return '#d6d3d1'
  }
}

/**
 * Build the inner HTML for a price-pill divIcon.
 * Pure string builder → unit-testable without a DOM. Featured tier gets a gold
 * star glyph. `selected` bumps size + shadow for the highlighted marker.
 */
export function buildMarkerHtml(property: MapProperty, opts?: { selected?: boolean }): string {
  const tier = markerTrustTier(property)
  const outline = trustOutlineHex(tier)
  const price = formatCompactKes(property.rentMin)
  const selected = opts?.selected ?? false
  const star = tier === 'featured' ? '<span style="margin-right:3px">★</span>' : ''
  const scale = selected ? 'transform:scale(1.12);z-index:1000;' : ''
  const shadow = selected ? '0 6px 16px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.15)'
  return (
    `<div class="nyumbani-price-pill" style="` +
    `display:inline-flex;align-items:center;white-space:nowrap;` +
    `padding:5px 10px;border-radius:9999px;` +
    `background:#ffffff;color:#1f2937;` +
    `font-weight:700;font-size:12px;line-height:1;` +
    `border:2px solid ${outline};box-shadow:${shadow};` +
    `cursor:pointer;transition:transform .15s ease, box-shadow .15s ease;${scale}` +
    `">${star}${price}</div>`
  )
}

/**
 * Build the inner HTML for a cluster divIcon (count in a branded circle).
 */
export function buildClusterHtml(count: number): string {
  const size = count < 10 ? 34 : count < 100 ? 40 : 48
  return (
    `<div style="` +
    `display:flex;align-items:center;justify-content:center;` +
    `width:${size}px;height:${size}px;border-radius:9999px;` +
    `background:#1f5e4a;color:#ffffff;font-weight:700;font-size:13px;` +
    `border:3px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.2);` +
    `">${count}</div>`
  )
}
