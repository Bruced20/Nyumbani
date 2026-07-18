import { describe, it, expect } from 'vitest'
import {
  describeFilters,
  hasActiveFilters,
  filtersSignature,
  DEFAULT_FILTERS,
} from './saved-search-utils'
import type { FilterState } from './search-filters'

const base = (over: Partial<FilterState> = {}): FilterState => ({ ...DEFAULT_FILTERS, ...over })

describe('describeFilters', () => {
  it('returns empty for default filters', () => {
    expect(describeFilters(base())).toBe('')
  })

  it('labels neighborhood and house type', () => {
    expect(describeFilters(base({ neighborhood: 'Kilimani', houseType: 'One Bedroom' }))).toBe(
      'Kilimani · One Bedroom'
    )
  })

  it('labels a rent range in compact k form', () => {
    expect(describeFilters(base({ rentMax: 40000 }))).toBe('KES 0–40k')
    expect(describeFilters(base({ rentMin: 10000, rentMax: 50000 }))).toBe('KES 10k–50k')
  })

  it('labels boolean facets', () => {
    expect(describeFilters(base({ verifiedOnly: true }))).toBe('Verified')
    expect(describeFilters(base({ vacancyOnly: true, recentlyUpdated: true }))).toBe(
      'Vacancy · Recent'
    )
  })

  it('joins multiple active filters with a middot', () => {
    const label = describeFilters(base({ neighborhood: 'Karen', verifiedOnly: true }))
    expect(label).toBe('Karen · Verified')
  })
})

describe('hasActiveFilters', () => {
  it('is false for defaults, true when something changes', () => {
    expect(hasActiveFilters(base())).toBe(false)
    expect(hasActiveFilters(base({ neighborhood: 'Westlands' }))).toBe(true)
    expect(hasActiveFilters(base({ rentMax: 40000 }))).toBe(true)
  })
})

describe('filtersSignature', () => {
  it('matches for equal filters and differs otherwise', () => {
    expect(filtersSignature(base({ neighborhood: 'Kilimani' }))).toBe(
      filtersSignature(base({ neighborhood: 'Kilimani' }))
    )
    expect(filtersSignature(base({ neighborhood: 'Kilimani' }))).not.toBe(
      filtersSignature(base({ neighborhood: 'Karen' }))
    )
  })
})
