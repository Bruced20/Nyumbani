'use client'

import React from 'react'
import { Switch } from '@ui/selection'
import { TextInput } from '@ui/input'
import { MOCK_NEIGHBORHOODS } from '@/lib/mock-data'

export interface FilterState {
  rentMin: number
  rentMax: number
  neighborhood: string
  verifiedOnly: boolean
}

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (newFilters: FilterState) => void
}

/**
 * Filter panel for searching properties.
 * Handles inputs for neighborhood selectors, price bounds, and verification tags.
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-bg-secondary border border-border-subtle p-sm rounded-symmetric flex flex-col gap-sm w-full">
      <div className="flex justify-between items-center border-b border-border-subtle pb-xxs">
        <h4 className="font-semibold text-subtitle text-text-primary">Search Filters</h4>
        <button
          onClick={() =>
            onFiltersChange({
              rentMin: 0,
              rentMax: 100000,
              neighborhood: '',
              verifiedOnly: false,
            })
          }
          className="text-[12px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* Neighborhood Selection Filter */}
      <div className="flex flex-col gap-xxs">
        <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">
          Neighborhood
        </label>
        <select
          value={filters.neighborhood}
          onChange={(e) => onFiltersChange({ ...filters, neighborhood: e.target.value })}
          className="w-full px-xs py-xxs bg-bg-primary text-text-primary border border-border-subtle rounded-soft text-[14px] focus:outline-none focus:border-brand-indigo"
        >
          <option value="">All Neighborhoods</option>
          {MOCK_NEIGHBORHOODS.map((hood) => (
            <option key={hood} value={hood.toLowerCase()}>
              {hood}
            </option>
          ))}
        </select>
      </div>

      {/* Rent Range Bounds */}
      <div className="flex flex-col gap-xxs">
        <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">
          Rent Bounds (KES)
        </label>
        <div className="flex gap-xs">
          <TextInput
            placeholder="Min"
            type="number"
            value={filters.rentMin || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, rentMin: parseInt(e.target.value) || 0 })
            }
            className="w-full text-center"
          />
          <TextInput
            placeholder="Max"
            type="number"
            value={filters.rentMax || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, rentMax: parseInt(e.target.value) || 0 })
            }
            className="w-full text-center"
          />
        </div>
      </div>

      {/* Verified Owner Listings only Toggle */}
      <div className="flex items-center justify-between border-t border-border-subtle pt-xs mt-xxs">
        <div className="flex flex-col gap-[2px]">
          <span className="text-[13px] font-medium text-text-primary">Verified Landlords Only</span>
          <span className="text-[11px] text-text-muted">
            Display listings audited by Nyumbani moderators
          </span>
        </div>
        <Switch
          checked={filters.verifiedOnly}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, verifiedOnly: checked })}
        />
      </div>
    </div>
  )
}
