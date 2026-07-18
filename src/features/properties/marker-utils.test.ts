import { describe, it, expect } from 'vitest'
import {
  formatCompactKes,
  markerTrustTier,
  trustOutlineHex,
  buildMarkerHtml,
  buildClusterHtml,
  HEALTHY_THRESHOLD,
  type MapProperty,
} from './marker-utils'

// Minimal Property factory — only fields the marker utils read.
function makeProperty(overrides: Partial<MapProperty> = {}): MapProperty {
  return {
    rentMin: 25000,
    healthScore: 4.0,
    isVerified: false,
    ...overrides,
  } as MapProperty
}

describe('formatCompactKes', () => {
  it('formats thousands with a K suffix', () => {
    expect(formatCompactKes(18000)).toBe('KSh 18K')
    expect(formatCompactKes(45000)).toBe('KSh 45K')
    expect(formatCompactKes(120000)).toBe('KSh 120K')
  })

  it('keeps one decimal for fractional thousands', () => {
    expect(formatCompactKes(18500)).toBe('KSh 18.5K')
  })

  it('formats millions with an M suffix', () => {
    expect(formatCompactKes(1_200_000)).toBe('KSh 1.2M')
    expect(formatCompactKes(2_000_000)).toBe('KSh 2M')
  })

  it('shows raw value under 1000', () => {
    expect(formatCompactKes(900)).toBe('KSh 900')
  })

  it('guards against invalid input', () => {
    expect(formatCompactKes(-5)).toBe('KSh —')
    expect(formatCompactKes(NaN)).toBe('KSh —')
  })
})

describe('markerTrustTier priority', () => {
  it('featured wins over everything', () => {
    const p = makeProperty({ isFeatured: true, isVerified: true, healthScore: 5 })
    expect(markerTrustTier(p)).toBe('featured')
  })

  it('verified wins over healthy', () => {
    const p = makeProperty({ isVerified: true, healthScore: 5 })
    expect(markerTrustTier(p)).toBe('verified')
  })

  it('healthy applies at or above the 4.5 threshold', () => {
    expect(markerTrustTier(makeProperty({ healthScore: HEALTHY_THRESHOLD }))).toBe('healthy')
    expect(markerTrustTier(makeProperty({ healthScore: 4.9 }))).toBe('healthy')
  })

  it('standard below the threshold with no badges', () => {
    expect(markerTrustTier(makeProperty({ healthScore: 4.49 }))).toBe('standard')
    expect(markerTrustTier(makeProperty({ healthScore: 3.0 }))).toBe('standard')
  })

  it('featured is dormant on real data (never set today)', () => {
    const real = makeProperty({ isVerified: true, healthScore: 4.8 })
    expect(markerTrustTier(real)).not.toBe('featured')
  })
})

describe('trustOutlineHex', () => {
  it('maps each tier to a distinct color', () => {
    const colors = new Set([
      trustOutlineHex('featured'),
      trustOutlineHex('verified'),
      trustOutlineHex('healthy'),
      trustOutlineHex('standard'),
    ])
    expect(colors.size).toBe(4)
  })
})

describe('buildMarkerHtml', () => {
  it('includes the compact price', () => {
    expect(buildMarkerHtml(makeProperty({ rentMin: 45000 }))).toContain('KSh 45K')
  })

  it('adds a star only for featured', () => {
    expect(buildMarkerHtml(makeProperty({ isFeatured: true }))).toContain('★')
    expect(buildMarkerHtml(makeProperty({ isVerified: true }))).not.toContain('★')
  })

  it('applies the tier outline color', () => {
    const verified = buildMarkerHtml(makeProperty({ isVerified: true }))
    expect(verified).toContain(trustOutlineHex('verified'))
  })

  it('scales up when selected', () => {
    expect(buildMarkerHtml(makeProperty(), { selected: true })).toContain('scale(1.12)')
    expect(buildMarkerHtml(makeProperty(), { selected: false })).not.toContain('scale(1.12)')
  })
})

describe('buildClusterHtml', () => {
  it('renders the count', () => {
    expect(buildClusterHtml(7)).toContain('>7<')
    expect(buildClusterHtml(150)).toContain('>150<')
  })
})
