'use client'

import React from 'react'
import { Switch } from '@ui/selection'
import { TextInput } from '@ui/input'
import {
  ChevronDown,
  ChevronUp,
  Droplet,
  Shield,
  Wifi,
  Zap,
  Car,
  Road,
  Trash2,
  UserCheck,
} from 'lucide-react'

export interface FilterState {
  rentMin: number
  rentMax: number
  neighborhood: string
  houseType: string
  waterRating: string
  electricityRating: string
  internetType: string
  securityRating: string
  parking: string
  roadType: string
  garbageReliability: string
  verifiedOnly: boolean
  communityListedOnly: boolean
  vacancyOnly: boolean
  recentlyUpdated: boolean
}

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (newFilters: FilterState) => void
}

/**
 * Advanced Filters Panel.
 * Redesigned against the calm-trust principles: one accent color reserved
 * for "this is selected," neutral gray everywhere else, and section labels
 * that don't shout.
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const propertyTypes = [
    'Single Room',
    'Bedsitter',
    'Studio',
    'One Bedroom',
    'Two Bedroom',
    'Three Bedroom',
  ]

  const priceChips = [
    { label: 'Under 8K', min: 0, max: 8000 },
    { label: 'Under 10K', min: 0, max: 10000 },
    { label: '10K – 20K', min: 10000, max: 20000 },
    { label: 'Above 20K', min: 20000, max: 150000 },
  ]

  const ratingOptions = ['Excellent', 'Good', 'Fair', 'Poor']

  const sectionLabel = 'text-[12px] font-semibold text-text-muted flex items-center gap-[4px]'
  const activeBtnClass = 'bg-brand-primary text-white border-transparent shadow-sm'
  const inactiveBtnClass =
    'bg-bg-primary text-text-primary border-border-subtle hover:bg-bg-primary/50 hover:border-text-muted/30'

  return (
    <div className="bg-bg-secondary border border-border-subtle p-md rounded-symmetric flex flex-col gap-md w-full shadow-sm">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-border-subtle pb-xs">
        <h4 className="font-bold text-[15px] text-text-primary tracking-tight">Search Filters</h4>
        <button
          onClick={() =>
            onFiltersChange({
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
            })
          }
          className="text-[13px] font-semibold text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* 1. Property Type Selector */}
      <div className="flex flex-col gap-xs">
        <span className={sectionLabel}>Property Type</span>
        <div className="flex flex-wrap gap-xs mt-xxs">
          {propertyTypes.map((type) => {
            const isSelected = filters.houseType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => onFiltersChange({ ...filters, houseType: isSelected ? '' : type })}
                className={`px-sm py-[8px] border text-[13px] font-semibold rounded-pill transition-all cursor-pointer select-none ${
                  isSelected ? activeBtnClass : inactiveBtnClass
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Rent Range Bounds & Quick Price Chips */}
      <div className="flex flex-col gap-xs border-t border-border-subtle pt-sm">
        <span className={sectionLabel}>KES Monthly Rent</span>

        {/* Quick price chips */}
        <div className="flex flex-wrap gap-xs">
          {priceChips.map((chip) => {
            const isActive = filters.rentMin === chip.min && filters.rentMax === chip.max
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    rentMin: chip.min,
                    rentMax: chip.max,
                  })
                }
                className={`px-sm py-[6px] border text-[13px] font-semibold rounded-soft cursor-pointer transition-all ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/25'
                    : 'bg-bg-primary text-text-primary border-border-subtle hover:bg-bg-primary/50'
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        {/* Custom Min/Max text inputs */}
        <div className="flex gap-xs mt-xxs items-center">
          <TextInput
            placeholder="Min Rent"
            type="number"
            value={filters.rentMin || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, rentMin: parseInt(e.target.value) || 0 })
            }
            className="w-full text-center"
          />
          <span className="text-text-muted text-[14px] font-semibold">—</span>
          <TextInput
            placeholder="Max Rent"
            type="number"
            value={filters.rentMax || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, rentMax: parseInt(e.target.value) || 150000 })
            }
            className="w-full text-center"
          />
        </div>
      </div>

      {/* 3. Collapsible Advanced/Community & Owner Filters */}
      <div className="border-t border-border-subtle pt-sm">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left text-[14px] font-semibold text-text-primary cursor-pointer hover:text-brand-primary transition-colors"
        >
          <span>Community Quality & Verification Filters</span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div className="flex flex-col gap-md mt-md">
            {/* Water Reliability Filter */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Droplet size={13} className="text-text-muted" />
                Water Reliability
              </span>
              <div className="grid grid-cols-4 gap-xs mt-xxs">
                {ratingOptions.map((opt) => {
                  const isSel = filters.waterRating === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => onFiltersChange({ ...filters, waterRating: isSel ? '' : opt })}
                      className={`py-[6px] border rounded-soft text-[12px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Power Reliability Filter */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Zap size={13} className="text-text-muted" />
                Power / Electricity
              </span>
              <div className="grid grid-cols-4 gap-xs mt-xxs">
                {ratingOptions.map((opt) => {
                  const isSel = filters.electricityRating === opt
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        onFiltersChange({ ...filters, electricityRating: isSel ? '' : opt })
                      }
                      className={`py-[6px] border rounded-soft text-[12px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Internet Type Filter */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Wifi size={13} className="text-text-muted" />
                Internet Type
              </span>
              <div className="grid grid-cols-3 gap-xs mt-xxs">
                {['Fiber Available', 'Mobile Internet Only', 'No Internet'].map((opt) => {
                  const isSel = filters.internetType === opt
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        onFiltersChange({ ...filters, internetType: isSel ? '' : opt })
                      }
                      className={`py-[6px] px-[2px] border rounded-soft text-[11px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Security Level Filter */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Shield size={13} className="text-text-muted" />
                Security Standards
              </span>
              <div className="grid grid-cols-4 gap-xs mt-xxs">
                {ratingOptions.map((opt) => {
                  const isSel = filters.securityRating === opt
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        onFiltersChange({ ...filters, securityRating: isSel ? '' : opt })
                      }
                      className={`py-[6px] border rounded-soft text-[12px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Parking space availability */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Car size={13} className="text-text-muted" />
                Parking Space
              </span>
              <div className="grid grid-cols-3 gap-xs mt-xxs">
                {['Available', 'Limited', 'None'].map((opt) => {
                  const isSel = filters.parking === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => onFiltersChange({ ...filters, parking: isSel ? '' : opt })}
                      className={`py-[6px] border rounded-soft text-[12px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Road Access type */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Road size={13} className="text-text-muted" />
                Road Access
              </span>
              <div className="grid grid-cols-3 gap-xs mt-xxs">
                {['Tarmac', 'Murram', 'Seasonal'].map((opt) => {
                  const isSel = filters.roadType === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => onFiltersChange({ ...filters, roadType: isSel ? '' : opt })}
                      className={`py-[6px] border rounded-soft text-[12px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Waste Collection */}
            <div className="flex flex-col gap-xs">
              <span className={sectionLabel}>
                <Trash2 size={13} className="text-text-muted" />
                Garbage Collection
              </span>
              <div className="grid grid-cols-3 gap-xs mt-xxs">
                {['Reliable', 'Occasional', 'Poor'].map((opt) => {
                  const isSel = filters.garbageReliability === opt
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        onFiltersChange({ ...filters, garbageReliability: isSel ? '' : opt })
                      }
                      className={`py-[6px] border rounded-soft text-[12px] font-semibold transition-all cursor-pointer ${
                        isSel ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Owner Verifications Toggles */}
            <div className="flex flex-col gap-sm border-t border-border-subtle pt-md">
              <span className={sectionLabel}>
                <UserCheck size={13} className="text-text-muted" />
                Owner & Listing Badges
              </span>

              {/* Verified Owner Only */}
              <div className="flex items-center justify-between py-xs">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-text-primary">
                    Verified Owner Only
                  </span>
                  <span className="text-[12px] text-text-muted">
                    Show properties authenticated by landlord documentation
                  </span>
                </div>
                <Switch
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, verifiedOnly: checked })
                  }
                />
              </div>

              {/* Community Listed */}
              <div className="flex items-center justify-between py-xs border-t border-border-subtle/40">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-text-primary">
                    Community Listed
                  </span>
                  <span className="text-[12px] text-text-muted">
                    Display crowd-sourced renter evaluations
                  </span>
                </div>
                <Switch
                  checked={filters.communityListedOnly}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, communityListedOnly: checked })
                  }
                />
              </div>

              {/* Vacancy Available */}
              <div className="flex items-center justify-between py-xs border-t border-border-subtle/40">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-text-primary">
                    Vacancy Available
                  </span>
                  <span className="text-[12px] text-text-muted">
                    Show apartments with open listing vacancies
                  </span>
                </div>
                <Switch
                  checked={filters.vacancyOnly}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, vacancyOnly: checked })
                  }
                />
              </div>

              {/* Recently Updated */}
              <div className="flex items-center justify-between py-xs border-t border-border-subtle/40">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-text-primary">
                    Recently Updated
                  </span>
                  <span className="text-[12px] text-text-muted">
                    Show properties updated in the last 14 days
                  </span>
                </div>
                <Switch
                  checked={filters.recentlyUpdated}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, recentlyUpdated: checked })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
