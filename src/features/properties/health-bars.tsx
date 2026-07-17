'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HealthBarsProps {
  ratings: {
    water: string // Excellent, Good, Fair, Poor
    electricity: string
    internet: string // Fiber Available, Mobile Internet Only, No Internet
    security: string
    parking: string // Available, Limited, None
    road: string // Tarmac, Murram, Seasonal
    garbage: string // Reliable, Occasional, Poor
  }
}

/**
 * HealthBars Component.
 * Animates category progress bars representing community ratings.
 * Refined for Sprint D1: removed Lucide icons next to category labels to prune visual noise.
 */
export const HealthBars: React.FC<HealthBarsProps> = ({ ratings }) => {
  // Helper to map rating string values to percentages out of 100
  const getPercentage = (val: string, type: 'standard' | 'parking' | 'road' | 'internet') => {
    if (type === 'internet') {
      if (val === 'Fiber Available') return 95
      if (val === 'Mobile Internet Only') return 60
      return 25
    }
    if (type === 'parking') {
      if (val === 'Available') return 90
      if (val === 'Limited') return 55
      return 20
    }
    if (type === 'road') {
      if (val === 'Tarmac') return 95
      if (val === 'Murram') return 60
      return 30
    }
    // Standard Excellent, Good, Fair, Poor ratings
    if (val === 'Excellent') return 95
    if (val === 'Good') return 75
    if (val === 'Fair') return 50
    return 25
  }

  const categories = [
    {
      label: 'Water Reliability',
      value: ratings.water,
      percent: getPercentage(ratings.water, 'standard'),
    },
    {
      label: 'Electricity Stability',
      value: ratings.electricity,
      percent: getPercentage(ratings.electricity, 'standard'),
    },
    {
      label: 'Internet Quality',
      value: ratings.internet,
      percent: getPercentage(ratings.internet, 'internet'),
    },
    {
      label: 'Security & Safety',
      value: ratings.security,
      percent: getPercentage(ratings.security, 'standard'),
    },
    {
      label: 'Parking Adequacy',
      value: ratings.parking,
      percent: getPercentage(ratings.parking, 'parking'),
    },
    {
      label: 'Road Access Quality',
      value: ratings.road,
      percent: getPercentage(ratings.road, 'road'),
    },
    {
      label: 'Garbage Collection',
      value: ratings.garbage,
      percent: getPercentage(ratings.garbage, 'standard'),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md w-full">
      {categories.map((cat) => (
        <div key={cat.label} className="flex flex-col gap-xxs">
          <div className="flex justify-between items-center text-[13px] font-medium text-text-primary">
            <span>{cat.label}</span>
            <span className="text-text-muted">{cat.value}</span>
          </div>

          {/* Animated Progress Bar track */}
          <div className="w-full h-[6px] bg-bg-secondary border border-border-subtle rounded-pill overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${cat.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-brand-primary rounded-pill"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
