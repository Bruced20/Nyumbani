'use client'

import React, { useState, useEffect } from 'react'
import { ThumbsUp, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-provider'
import { useToast } from '@ui/feedback/toast-context'
import { Modal } from '@ui/overlay'
import { Button } from '@ui/button'
import { REPORT_REASONS } from '@/lib/validators'
import {
  toggleHelpfulAction,
  getHelpfulStateAction,
  submitReportAction,
} from '@/features/reviews/actions'

interface ReviewCardActionsProps {
  reviewId: string
}

/**
 * Review Card Actions — real Helpful votes and Report flow.
 * Helpful votes persist to the database (per-user, toggleable) and show a live
 * aggregate count. Report opens a reason picker and files a real, admin-only
 * moderation report. Both intercept guests with the auth dialog.
 */
export const ReviewCardActions: React.FC<ReviewCardActionsProps> = ({ reviewId }) => {
  const { user, triggerProtectedAction } = useAuth()
  const toast = useToast()

  const [helpfulCount, setHelpfulCount] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const [reportOpen, setReportOpen] = useState(false)
  const [hasReported, setHasReported] = useState(false)
  const [reason, setReason] = useState<(typeof REPORT_REASONS)[number] | null>(null)
  const [isReporting, setIsReporting] = useState(false)

  // Load the live vote state (public count + this user's vote) on mount and when
  // the signed-in user changes.
  useEffect(() => {
    let active = true
    getHelpfulStateAction(reviewId).then((state) => {
      if (!active) return
      setHelpfulCount(state.count)
      setHasVoted(state.voted)
    })
    return () => {
      active = false
    }
  }, [reviewId, user?.id])

  const handleHelpfulClick = () => {
    triggerProtectedAction(async () => {
      if (isVoting) return
      const next = !hasVoted
      // Optimistic update.
      setHasVoted(next)
      setHelpfulCount((c) => Math.max(0, c + (next ? 1 : -1)))
      setIsVoting(true)
      try {
        const result = await toggleHelpfulAction({ reviewId, on: next })
        if (result.success && typeof result.count === 'number') {
          // Reconcile with the authoritative count.
          setHelpfulCount(result.count)
          setHasVoted(!!result.voted)
        } else {
          // Roll back on failure.
          setHasVoted(!next)
          setHelpfulCount((c) => Math.max(0, c + (next ? -1 : 1)))
          if (result.error) toast.error(result.error)
        }
      } catch {
        setHasVoted(!next)
        setHelpfulCount((c) => Math.max(0, c + (next ? -1 : 1)))
        toast.error('Could not record your vote.')
      } finally {
        setIsVoting(false)
      }
    })
  }

  const openReport = () => {
    triggerProtectedAction(() => {
      setReason(null)
      setReportOpen(true)
    })
  }

  const submitReport = async () => {
    if (!reason || isReporting) return
    setIsReporting(true)
    try {
      const result = await submitReportAction({ reviewId, reason })
      if (result.success) {
        setHasReported(true)
        setReportOpen(false)
        toast.success({
          message: 'Report submitted',
          description: 'Our moderation team will review it shortly.',
        })
      } else if (result.alreadyReported) {
        setHasReported(true)
        setReportOpen(false)
        toast.info('You have already reported this review')
      } else {
        toast.error(result.error || 'Could not file the report.')
      }
    } catch {
      toast.error('Could not file the report.')
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <>
      <div className="flex gap-md border-t border-border-subtle pt-xs mt-xxs">
        <button
          onClick={handleHelpfulClick}
          disabled={isVoting}
          className={`text-[12px] flex items-center gap-[5px] cursor-pointer transition-colors disabled:opacity-60 ${
            hasVoted
              ? 'text-brand-primary font-semibold'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <ThumbsUp size={12} className={hasVoted ? 'fill-brand-primary/15' : ''} />
          Helpful{helpfulCount > 0 ? ` · ${helpfulCount}` : ''}
        </button>

        <button
          onClick={openReport}
          disabled={hasReported}
          className={`text-[12px] flex items-center gap-[5px] cursor-pointer transition-colors disabled:opacity-70 ${
            hasReported
              ? 'text-status-error font-semibold'
              : 'text-text-muted hover:text-status-error'
          }`}
        >
          <AlertTriangle size={12} />
          {hasReported ? 'Reported' : 'Report'}
        </button>
      </div>

      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report this review">
        <div className="flex flex-col gap-sm">
          <p className="text-[13px] text-text-muted">
            Why are you reporting this review? Reports are private and reviewed by our moderation
            team.
          </p>
          <div className="flex flex-col gap-xxs">
            {REPORT_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`text-left px-sm py-xs border rounded-soft text-[13px] font-medium transition-colors cursor-pointer ${
                  reason === r
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                    : 'border-border-subtle text-text-primary hover:bg-bg-secondary'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-xs pt-xs">
            <Button variant="outline" onClick={() => setReportOpen(false)} disabled={isReporting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitReport} disabled={!reason || isReporting}>
              {isReporting ? 'Submitting...' : 'Submit report'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
