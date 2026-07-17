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
 */
export const VerifiedOwnerBadge: React.FC = () => {
  return (
    <Badge className="bg-status-success/5 text-status-success border-status-success/20">
      <ShieldCheck size={12} className="shrink-0" />
      Verified Owner
    </Badge>
  )
}

/**
 * VerifiedResidentBadge: Confirms review writer actually resides in the building.
 */
export const VerifiedResidentBadge: React.FC = () => {
  return (
    <Badge className="bg-brand-primary/5 text-brand-primary border-brand-primary/20">
      <UserCheck size={12} className="shrink-0" />
      Verified Resident
    </Badge>
  )
}

/**
 * CommunityListingBadge: Highlights public crowd-sourced entries.
 */
export const CommunityListingBadge: React.FC = () => {
  return (
    <Badge className="bg-bg-secondary text-text-muted border-border-subtle">
      <Eye size={12} className="shrink-0" />
      Community Listing
    </Badge>
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
 * HealthScore Badge: Rendered as circular color tag (Success, Warning, Error).
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
        'inline-flex items-center justify-center font-semibold px-[8px] py-[3px] rounded-soft text-[12px] text-white shadow-sm border border-transparent select-none',
        isHigh && 'bg-status-success',
        isMid && 'bg-status-warning',
        !isHigh && !isMid && 'bg-status-error',
        className
      )}
    >
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
