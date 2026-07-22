'use client'

import React from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ShieldCheck, Droplet, Lock, Star } from 'lucide-react'
import { HealthScore, VerifiedResidentBadge } from '../badge'

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
  // Distance from the visitor's current location, in kilometers — only set
  // when the caller has geolocation permission (e.g. "Near Me" search).
  distanceKm?: number
  // Quick ratings
  waterRating?: number
  securityRating?: number
  caretakerRating?: number
}

/**
 * PropertyCard: Summary layout details for search results and homepage grids.
 * Refined for Sprint D2: visual hierarchy, soft titles, and consistent reduced-motion states.
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
  distanceKm,
  waterRating,
  securityRating,
  caretakerRating,
}) => {
  const shouldReduceMotion = useReducedMotion()

  // Only show vectors the caller actually has data for — never default a
  // rating into existence on a trust platform.
  const vectors = [
    waterRating !== undefined && { icon: <Droplet size={12} />, value: `${waterRating}/5` },
    securityRating !== undefined && { icon: <Lock size={12} />, value: `${securityRating}/5` },
    caretakerRating !== undefined && {
      icon: <ShieldCheck size={12} />,
      value: `${caretakerRating}/5`,
    },
  ].filter(Boolean) as { icon: React.ReactNode; value: string }[]

  return (
    <div onClick={onClick} className="group flex flex-col cursor-pointer select-none">
      {/* Image-first: rounded photo, no box/border/shadow — the card IS the image */}
      <div className="w-full aspect-[4/3] bg-bg-secondary relative overflow-hidden rounded-soft">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-500',
              shouldReduceMotion ? '' : 'group-hover:scale-105'
            )}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-text-muted text-[13px] font-medium">
            No image provided
          </span>
        )}

        {/* Floating Health Score — white pill reads calmly over photography */}
        <div className="absolute top-xs right-xs z-10">
          <HealthScore score={healthScore} />
        </div>
      </div>

      {/* Property Details — fixed-height block so every card in a grid aligns,
          regardless of whether optional rating vectors are present. */}
      <div className="pt-xs flex flex-col gap-[2px]">
        <div className="flex items-center justify-between gap-xxs">
          <h3 className="font-semibold text-[15px] text-text-primary leading-snug truncate">
            {name}
          </h3>
          {isVerified && (
            <ShieldCheck
              size={14}
              className="shrink-0 text-brand-primary"
              aria-label="Verified owner"
            />
          )}
        </div>

        <p className="text-[14px] text-text-muted truncate">
          {neighborhood} · {houseType}
          {distanceKm !== undefined && ` · ${distanceKm.toFixed(1)} km away`}
        </p>

        {/* Reserve a single line for vectors so cards with and without ratings
            keep identical heights (no layout stretch across the grid). */}
        <div className="flex items-center gap-sm text-[12px] text-text-muted min-h-[18px]">
          <span className="flex items-center gap-[3px] shrink-0 font-medium text-text-primary">
            <Star size={12} className="fill-brand-primary text-brand-primary" />
            {healthScore.toFixed(1)}
          </span>
          {vectors.map((v, idx) => (
            <span key={idx} className="flex items-center gap-[3px] shrink-0">
              {v.icon}
              {v.value}
            </span>
          ))}
        </div>

        <p className="text-[15px] font-semibold text-text-primary mt-[2px]">
          {rentMin.toLocaleString()} – {rentMax.toLocaleString()} KES{' '}
          <span className="text-text-muted font-normal text-[13px]">/ month</span>
        </p>
      </div>
    </div>
  )
}

interface ReviewCardProps {
  roleTag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
  createdAt: string
  /** Overall star rating as submitted by the reviewer. */
  overallRating?: number
  /** Per-vector ratings — rendered only when the reviewer actually provided them. */
  waterRating?: number
  securityRating?: number
  caretakerRating?: number
  recommend?: 'Yes' | 'Maybe' | 'No'
  comment: string | null
  isVerifiedResident?: boolean
}

/**
 * ReviewCard: Represents user feedback details on Property pages.
 * Refined for Sprint D2: flat spacing and soft dividers.
 * Only renders data the reviewer actually submitted — vectors, recommendation,
 * and overall rating are all optional and never derived from one another.
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({
  roleTag,
  createdAt,
  overallRating,
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
    Yes: 'text-status-success',
    Maybe: 'text-status-warning',
    No: 'text-status-error',
  }

  const hasVectors =
    waterRating !== undefined || securityRating !== undefined || caretakerRating !== undefined

  return (
    <div className="flex flex-col gap-sm py-sm">
      {/* Header Info */}
      <header className="flex justify-between items-center flex-wrap gap-xs">
        <div className="flex items-center gap-sm">
          {/* Avatar Icon */}
          <div className="h-9 w-9 rounded-pill bg-bg-primary border border-border-subtle flex items-center justify-center font-semibold text-[13px] text-brand-primary">
            {roleTag[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[14px] text-text-primary">{roleTag}</span>
            <span className="text-[12px] text-text-muted">
              Reviewed on{' '}
              {new Date(createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          {overallRating !== undefined && (
            <span className="text-[14px] font-semibold text-text-primary">
              {overallRating.toFixed(1)}
              <span className="text-text-muted font-normal text-[12px]"> / 5</span>
            </span>
          )}
          {isVerifiedResident && <VerifiedResidentBadge />}
        </div>
      </header>

      {/* Recommendation — only when the reviewer answered the question */}
      {recommend && (
        <p className={cn('text-[13px] font-semibold', recommendColors[recommend])}>
          {recommendLabels[recommend]}
        </p>
      )}

      {/* Ratings Vectors Breakdown — plain inline row, no dividers */}
      {hasVectors && (
        <div className="flex flex-wrap gap-md text-[13px] text-text-muted font-medium">
          {waterRating !== undefined && (
            <span>
              Water: <strong className="text-text-primary font-semibold">{waterRating}/5</strong>
            </span>
          )}
          {securityRating !== undefined && (
            <span>
              Security:{' '}
              <strong className="text-text-primary font-semibold">{securityRating}/5</strong>
            </span>
          )}
          {caretakerRating !== undefined && (
            <span>
              Caretaker:{' '}
              <strong className="text-text-primary font-semibold">{caretakerRating}/5</strong>
            </span>
          )}
        </div>
      )}

      {/* Comment text body */}
      {comment && (
        <p className="text-[15px] text-text-primary/95 leading-relaxed whitespace-pre-line">
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
    <div className="flex items-center justify-between gap-sm">
      <div className="flex flex-col gap-xxs">
        <span className="text-[12px] font-medium text-text-muted/90">{title}</span>
        <span className="text-[28px] font-semibold text-text-primary tracking-tight leading-none mt-xxs">
          {value}
        </span>
        {description && <span className="text-[12px] text-text-muted mt-xxs">{description}</span>}
      </div>
      {icon && <div className="text-brand-primary">{icon}</div>}
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
    <div className={cn('flex flex-col gap-sm', className)}>
      <h3 className="font-medium text-[16px] text-text-primary border-b border-border-subtle pb-xs">
        {title}
      </h3>
      <div className="text-[15px] leading-relaxed text-text-muted">{children}</div>
    </div>
  )
}
