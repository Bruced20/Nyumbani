'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@ui/feedback/toast-context'
import { Button } from '@ui/button'
import { Modal } from '@ui/overlay'
import { AlertTriangle, ShieldCheck, FileText, ExternalLink } from 'lucide-react'
import type { FlaggedReview, PendingClaimView } from '@/lib/services/moderation'
import {
  hideReviewAction,
  restoreReviewAction,
  approveClaimAction,
  rejectClaimAction,
} from './actions'

interface ModerationQueueProps {
  flaggedReviews: FlaggedReview[]
  pendingClaims: PendingClaimView[]
}

/**
 * Admin moderation console.
 * Two live queues — flagged reviews (soft-hide / restore with a reason) and
 * pending landlord claims (approve / reject). All actions call role-checked
 * server actions and refresh the queues. Nothing is hard-deleted.
 */
export function ModerationQueue({ flaggedReviews, pendingClaims }: ModerationQueueProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-lg">
      <section className="flex flex-col gap-sm">
        <h2 className="font-semibold text-[15px] text-text-primary flex items-center gap-xs">
          <AlertTriangle size={16} className="text-status-error" />
          Flagged reviews
          <span className="text-text-muted font-normal">({flaggedReviews.length})</span>
        </h2>
        {flaggedReviews.length === 0 ? (
          <p className="text-[13px] text-text-muted py-sm">No reviews awaiting moderation.</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {flaggedReviews.map((item) => (
              <FlaggedReviewCard key={item.review.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-sm lg:border-l lg:border-border-subtle lg:pl-lg">
        <h2 className="font-semibold text-[15px] text-text-primary flex items-center gap-xs">
          <ShieldCheck size={16} className="text-brand-primary" />
          Landlord claims
          <span className="text-text-muted font-normal">({pendingClaims.length})</span>
        </h2>
        {pendingClaims.length === 0 ? (
          <p className="text-[13px] text-text-muted py-sm">No pending verification claims.</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {pendingClaims.map((item) => (
              <ClaimCard key={item.claim.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FlaggedReviewCard({ item }: { item: FlaggedReview }) {
  const router = useRouter()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [hideOpen, setHideOpen] = useState(false)
  const [reason, setReason] = useState('')
  const hidden = item.review.isModerated

  const doHide = async () => {
    if (!reason.trim()) return
    setBusy(true)
    const result = await hideReviewAction(item.review.id, reason)
    setBusy(false)
    if (result.success) {
      toast.success('Review hidden')
      setHideOpen(false)
      setReason('')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to hide review.')
    }
  }

  const doRestore = async () => {
    setBusy(true)
    const result = await restoreReviewAction(item.review.id)
    setBusy(false)
    if (result.success) {
      toast.success('Review restored')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to restore review.')
    }
  }

  return (
    <div className="flex flex-col gap-xs p-sm border border-border-subtle rounded-symmetric bg-bg-secondary">
      <div className="flex items-center justify-between gap-xs">
        <span className="inline-flex items-center gap-[5px] text-[12px] font-semibold text-status-error">
          <AlertTriangle size={12} />
          {item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}
        </span>
        {hidden && (
          <span className="text-[11px] font-semibold text-text-muted px-xs py-[2px] rounded-pill bg-bg-primary border border-border-subtle">
            Hidden
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-[4px]">
        {item.reasons.map((r) => (
          <span
            key={r}
            className="text-[11px] px-xs py-[2px] rounded-pill bg-status-error/10 text-status-error"
          >
            {r}
          </span>
        ))}
      </div>

      <p className="text-[13px] text-text-primary leading-relaxed">
        {item.review.comment ? (
          `“${item.review.comment}”`
        ) : (
          <em className="text-text-muted">No written comment.</em>
        )}
      </p>

      <div className="flex items-center justify-between text-[12px] text-text-muted">
        <span>
          {item.review.roleTag} · {item.review.rating.toFixed(1)}/5
        </span>
        {item.propertySlug ? (
          <Link
            href={`/property/${item.propertySlug}`}
            className="inline-flex items-center gap-[3px] hover:text-brand-primary"
          >
            {item.propertyName} <ExternalLink size={11} />
          </Link>
        ) : (
          <span>{item.propertyName}</span>
        )}
      </div>

      <div className="flex gap-xs pt-xs border-t border-border-subtle">
        {hidden ? (
          <Button variant="outline" onClick={doRestore} disabled={busy} className="text-[13px]">
            Restore review
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={() => setHideOpen(true)}
            disabled={busy}
            className="text-[13px]"
          >
            Hide review
          </Button>
        )}
      </div>

      <Modal isOpen={hideOpen} onClose={() => setHideOpen(false)} title="Hide this review">
        <div className="flex flex-col gap-sm">
          <p className="text-[13px] text-text-muted">
            Hiding is reversible and recorded in the moderation log. Give a reason for
            accountability.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Contains a personal phone number and advertising."
            className="w-full p-sm text-[14px] bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-primary resize-none"
          />
          <div className="flex justify-end gap-xs">
            <Button variant="outline" onClick={() => setHideOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={doHide} disabled={!reason.trim() || busy}>
              {busy ? 'Hiding...' : 'Hide review'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ClaimCard({ item }: { item: PendingClaimView }) {
  const router = useRouter()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')

  const doApprove = async () => {
    setBusy(true)
    const result = await approveClaimAction(item.claim.id)
    setBusy(false)
    if (result.success) {
      toast.success({ message: 'Claim approved', description: 'The property is now verified.' })
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to approve claim.')
    }
  }

  const doReject = async () => {
    if (!reason.trim()) return
    setBusy(true)
    const result = await rejectClaimAction(item.claim.id, reason)
    setBusy(false)
    if (result.success) {
      toast.info('Claim rejected')
      setRejectOpen(false)
      setReason('')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to reject claim.')
    }
  }

  return (
    <div className="flex flex-col gap-xs p-sm border border-border-subtle rounded-symmetric bg-bg-secondary">
      <div className="flex items-center justify-between gap-xs">
        <span className="text-[13px] font-semibold text-text-primary">{item.propertyName}</span>
        <span className="text-[11px] font-semibold text-brand-primary px-xs py-[2px] rounded-pill bg-brand-primary/10">
          Pending
        </span>
      </div>

      <a
        href={item.claim.documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[5px] text-[12px] text-text-muted hover:text-brand-primary w-fit"
      >
        <FileText size={13} /> View ownership document <ExternalLink size={11} />
      </a>

      <div className="flex gap-xs pt-xs border-t border-border-subtle">
        <Button variant="primary" onClick={doApprove} disabled={busy} className="text-[13px]">
          Approve
        </Button>
        <Button
          variant="outline"
          onClick={() => setRejectOpen(true)}
          disabled={busy}
          className="text-[13px]"
        >
          Reject
        </Button>
      </div>

      <Modal isOpen={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject this claim">
        <div className="flex flex-col gap-sm">
          <p className="text-[13px] text-text-muted">
            Explain why the claim was rejected. The reason is stored for the applicant and the log.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Document is unreadable or does not match the property address."
            className="w-full p-sm text-[14px] bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-primary resize-none"
          />
          <div className="flex justify-end gap-xs">
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={doReject} disabled={!reason.trim() || busy}>
              {busy ? 'Rejecting...' : 'Reject claim'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
