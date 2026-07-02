'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardHoverPreset } from '../animations'
import { Droplet, Shield, Clock, MapPin } from 'lucide-react'
import {
  HealthScore,
  VerifiedOwnerBadge,
  VerifiedResidentBadge,
  CommunityListingBadge,
} from '../badge'

interface PropertyCardProps {
  name: string
  neighborhood: string
  rentMin: number
  rentMax: number
  houseType: string
  healthScore: number
  imageUrl?: string
  isVerified?: boolean
  onClick?: () => void
  // Quick ratings
  waterRating?: number
  securityRating?: number
  caretakerRating?: number
}

/**
 * PropertyCard: Summary layout details for search results and homepage grids.
 * Implements hover scaling and spring-based layouts (Design Bible Section 11).
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  name,
  neighborhood,
  rentMin,
  rentMax,
  houseType,
  healthScore,
  imageUrl,
  isVerified = false,
  onClick,
  waterRating = 5,
  securityRating = 5,
  caretakerRating = 5,
}) => {
  return (
    <motion.div
      variants={cardHoverPreset}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="flex flex-col bg-bg-primary border border-border-subtle rounded-symmetric overflow-hidden shadow-sm cursor-pointer select-none"
    >
      {/* Property Image Cover */}
      <div className="w-full aspect-[4/3] bg-bg-secondary relative overflow-hidden flex items-center justify-center border-b border-border-subtle">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-text-muted text-[13px]">No image provided</span>
        )}

        {/* Floating Health Score Badge */}
        <div className="absolute top-xs right-xs z-10">
          <HealthScore score={healthScore} />
        </div>
      </div>

      {/* Property Details */}
      <div className="p-sm flex flex-col gap-[6px]">
        <div className="flex items-center gap-xxs flex-wrap">
          <h3 className="font-semibold text-[15px] text-text-primary leading-snug truncate max-w-[70%]">
            {name}
          </h3>
          {isVerified ? <VerifiedOwnerBadge /> : <CommunityListingBadge />}
        </div>

        <p className="text-[13px] text-text-muted flex items-center gap-[4px]">
          <MapPin size={14} className="shrink-0" />
          {neighborhood} • {houseType}
        </p>

        <p className="text-[14px] font-semibold text-text-primary mt-xxs">
          {rentMin.toLocaleString()} - {rentMax.toLocaleString()} KES{' '}
          <span className="text-text-muted font-normal text-[12px]">/ month</span>
        </p>

        {/* Dynamic Vector Quick Indicator Bar */}
        <div className="flex gap-xs border-t border-border-subtle pt-xs mt-xs text-text-muted text-[12px] font-medium justify-between">
          <span className="flex items-center gap-[4px]">
            <Droplet
              size={13}
              className={waterRating > 3 ? 'text-accent-emerald' : 'text-accent-coral'}
            />
            Water {waterRating}/5
          </span>
          <span className="flex items-center gap-[4px]">
            <Shield
              size={13}
              className={securityRating > 3 ? 'text-accent-emerald' : 'text-accent-coral'}
            />
            Security {securityRating}/5
          </span>
          <span className="flex items-center gap-[4px]">
            <Clock
              size={13}
              className={caretakerRating > 3 ? 'text-accent-emerald' : 'text-accent-coral'}
            />
            Caretaker {caretakerRating}/5
          </span>
        </div>
      </div>
    </motion.div>
  )
}

interface ReviewCardProps {
  roleTag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
  createdAt: string
  waterRating: number
  securityRating: number
  caretakerRating: number
  recommend: 'Yes' | 'Maybe' | 'No'
  comment: string | null
  isVerifiedResident?: boolean
}

/**
 * ReviewCard: Represents user feedback details on Property pages (Design Bible Section 12).
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({
  roleTag,
  createdAt,
  waterRating,
  securityRating,
  caretakerRating,
  recommend,
  comment,
  isVerifiedResident = false,
}) => {
  const recommendLabels = {
    Yes: 'Recommends living here',
    Maybe: 'Might recommend living here',
    No: 'Does not recommend living here',
  }

  const recommendColors = {
    Yes: 'text-accent-emerald bg-accent-emerald/5 border-accent-emerald/10',
    Maybe: 'text-accent-amber bg-accent-amber/5 border-accent-amber/10',
    No: 'text-accent-coral bg-accent-coral/5 border-accent-coral/10',
  }

  return (
    <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col gap-xs">
      {/* Header Info */}
      <header className="flex justify-between items-center flex-wrap gap-xs">
        <div className="flex items-center gap-xs">
          {/* Avatar Icon */}
          <div className="h-8 w-8 rounded-pill bg-border-subtle flex items-center justify-center font-bold text-[12px] text-text-muted">
            {roleTag[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[13px] text-text-primary">{roleTag}</span>
            <span className="text-[11px] text-text-muted">
              Reviewed on{' '}
              {new Date(createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        {isVerifiedResident && <VerifiedResidentBadge />}
      </header>

      {/* Structured Recommendation Pill */}
      <div
        className={cn(
          'self-start px-xs py-[2px] rounded-pill border text-[11px] font-bold uppercase tracking-wider',
          recommendColors[recommend]
        )}
      >
        {recommendLabels[recommend]}
      </div>

      {/* Ratings Vectors Breakdown */}
      <div className="grid grid-cols-3 gap-xs py-xxs border-y border-border-subtle text-[12px] text-text-muted">
        <div>
          Water: <strong className="text-text-primary">{waterRating}/5</strong>
        </div>
        <div>
          Security: <strong className="text-text-primary">{securityRating}/5</strong>
        </div>
        <div>
          Caretaker: <strong className="text-text-primary">{caretakerRating}/5</strong>
        </div>
      </div>

      {/* Comment text body */}
      {comment && (
        <p className="text-[14px] text-text-primary leading-relaxed mt-xxs whitespace-pre-line">
          {comment}
        </p>
      )}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

/**
 * StatCard: Visual representation of numeric metrics.
 */
export const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-xxs">
        <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">
          {title}
        </span>
        <span className="text-[24px] font-bold text-text-primary tracking-tight leading-none mt-xxs">
          {value}
        </span>
        {description && <span className="text-[11px] text-text-muted mt-xxs">{description}</span>}
      </div>
      {icon && <div className="text-brand-indigo">{icon}</div>}
    </div>
  )
}

interface InformationCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

/**
 * InformationCard: Container for details.
 */
export const InformationCard: React.FC<InformationCardProps> = ({ title, children, className }) => {
  return (
    <div
      className={cn(
        'p-sm bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col gap-xs shadow-sm',
        className
      )}
    >
      <h3 className="font-semibold text-subtitle text-text-primary border-b border-border-subtle pb-xxs">
        {title}
      </h3>
      <div className="text-[14px] leading-relaxed text-text-muted">{children}</div>
    </div>
  )
}
