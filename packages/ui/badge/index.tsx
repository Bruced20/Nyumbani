import React from 'react'
import { cn } from '@/lib/utils'
import { ShieldCheck, UserCheck, Eye, Sparkles } from 'lucide-react'

interface BadgeProps {
  className?: string
  children: React.ReactNode
}

/**
 * Atomic Base Badge Component.
 */
export const Badge: React.FC<BadgeProps> = ({ className, children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[4px] px-xs py-[2px] rounded-pill text-[11px] font-bold uppercase tracking-wider border',
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
    <Badge className="bg-accent-emerald/5 text-accent-emerald border-accent-emerald/20">
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
    <Badge className="bg-brand-indigo/5 text-brand-indigo border-brand-indigo/20">
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
    <Badge className="bg-brand-indigo text-white border-transparent">
      <Sparkles size={11} className="shrink-0" />
      AI Insight
    </Badge>
  )
}

/**
 * HealthScore Badge: Rendered as circular color tag (Green, Amber, Coral).
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
        'inline-flex items-center justify-center font-bold px-[8px] py-[3px] rounded-soft text-[12px] text-white shadow-sm border border-transparent select-none',
        isHigh && 'bg-accent-emerald',
        isMid && 'bg-accent-amber',
        !isHigh && !isMid && 'bg-accent-coral',
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
    Pending: 'bg-accent-amber/5 text-accent-amber border-accent-amber/20',
    Approved: 'bg-accent-emerald/5 text-accent-emerald border-accent-emerald/20',
    Rejected: 'bg-accent-coral/5 text-accent-coral border-accent-coral/20',
  }

  return <Badge className={styles[status]}>{status}</Badge>
}
