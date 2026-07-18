import React from 'react'
import { cn } from '@/lib/utils'
import { ShieldCheck, UserCheck, Eye, Sparkles } from 'lucide-react'

interface BadgeProps {
  className?: string
  children: React.ReactNode
}

/**
 * Atomic Base Badge Component.
 * Restyled to mixed-case, quieter semibold font for a calm, premium visual.
 */
export const Badge: React.FC<BadgeProps> = ({ className, children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-pill text-[11px] font-semibold border select-none',
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * VerifiedOwnerBadge: Represents verified landlord-owned property listings.
 * Quiet text+icon — no tinted fill, calmer at card scale.
 */
export const VerifiedOwnerBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-[4px] text-[12px] font-medium text-brand-primary select-none">
      <ShieldCheck size={13} className="shrink-0" />
      Verified Owner
    </span>
  )
}

/**
 * VerifiedResidentBadge: Confirms review writer actually resides in the building.
 */
export const VerifiedResidentBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-[4px] text-[12px] font-medium text-brand-primary select-none">
      <UserCheck size={13} className="shrink-0" />
      Verified Resident
    </span>
  )
}

/**
 * CommunityListingBadge: Highlights public crowd-sourced entries.
 */
export const CommunityListingBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-[4px] text-[12px] font-medium text-text-muted select-none">
      <Eye size={13} className="shrink-0" />
      Community Listing
    </span>
  )
}

/**
 * AISummaryBadge: Identifies auto-generated highlights.
 */
export const AISummaryBadge: React.FC = () => {
  return (
    <Badge className="bg-brand-primary text-white border-transparent">
      <Sparkles size={11} className="shrink-0" />
      AI Insight
    </Badge>
  )
}

/**
 * HealthScore Badge: Airbnb-style white pill — white background, charcoal text,
 * a small colored tier dot (green/amber/red). Calm over photography.
 */
export const HealthScore: React.FC<{ score: number; className?: string }> = ({
  score,
  className,
}) => {
  const isHigh = score >= 4.0
  const isMid = score >= 2.5 && score < 4.0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] font-semibold px-[8px] py-[4px] rounded-pill text-[12px] bg-white text-[#222222] shadow-sm select-none',
        className
      )}
    >
      <span
        className={cn(
          'h-[7px] w-[7px] rounded-pill shrink-0',
          isHigh && 'bg-status-success',
          isMid && 'bg-status-warning',
          !isHigh && !isMid && 'bg-status-error'
        )}
      />
      {score.toFixed(1)}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected'
}

/**
 * StatusBadge: For claims and administrative states.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    Pending: 'bg-status-warning/5 text-status-warning border-status-warning/20',
    Approved: 'bg-status-success/5 text-status-success border-status-success/20',
    Rejected: 'bg-status-error/5 text-status-error border-status-error/20',
  }

  return <Badge className={styles[status]}>{status}</Badge>
}
