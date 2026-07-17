'use client'

import React, { useState } from 'react'
import { ThumbsUp, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-provider'
import { logger } from '@/lib/utils/logger'

interface ReviewCardActionsProps {
  reviewId: string
}

/**
 * Review Card Actions.
 * Interactive Helpful and Report buttons that intercept guest clicks with auth dialogs.
 */
export const ReviewCardActions: React.FC<ReviewCardActionsProps> = ({ reviewId }) => {
  const { triggerProtectedAction } = useAuth()
  const [helpfulCount, setHelpfulCount] = useState(0)
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false)
  const [hasReported, setHasReported] = useState(false)

  const handleHelpfulClick = () => {
    triggerProtectedAction(() => {
      if (hasVotedHelpful) return
      logger.info('ReviewCardActions: Review marked helpful.', { reviewId })
      setHelpfulCount(helpfulCount + 1)
      setHasVotedHelpful(true)
    })
  }

  const handleReportClick = () => {
    triggerProtectedAction(() => {
      if (hasReported) return
      logger.info('ReviewCardActions: Review reported.', { reviewId })
      setHasReported(true)
      alert('Review reported successfully. Our moderation team will audit this post shortly.')
    })
  }

  return (
    <div className="flex gap-xs border-t border-border-subtle pt-xs mt-xxs">
      <button
        onClick={handleHelpfulClick}
        className={`text-[12px] flex items-center gap-[4px] cursor-pointer transition-colors ${
          hasVotedHelpful
            ? 'text-brand-primary font-bold'
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        <ThumbsUp size={12} className={hasVotedHelpful ? 'fill-brand-primary/10' : ''} />
        Helpful {helpfulCount > 0 ? `(${helpfulCount})` : ''}
      </button>

      <button
        onClick={handleReportClick}
        className={`text-[12px] flex items-center gap-[4px] cursor-pointer transition-colors ${
          hasReported
            ? 'text-status-error font-semibold'
            : 'text-text-muted hover:text-status-error'
        }`}
      >
        <AlertTriangle size={12} />
        {hasReported ? 'Reported' : 'Report'}
      </button>
    </div>
  )
}
