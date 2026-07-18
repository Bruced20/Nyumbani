'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import { ModerationService } from '@/lib/services/moderation'
import { AuthorizationError } from '@/lib/errors'
import { logger } from '@/lib/utils/logger'
import { revalidatePath } from 'next/cache'

type ActionResult = { success: boolean; error?: string }

/**
 * Admin moderation server actions.
 * Each re-verifies the caller's Admin role server-side (RBAC layer 2) before
 * touching privileged data — never trusting middleware alone.
 */

export async function hideReviewAction(reviewId: string, reason: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()
    if (!reason.trim()) return { success: false, error: 'A reason is required to hide a review.' }
    await ModerationService.hideReview(reviewId, admin.id, reason.trim())
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    return failure(err, 'Failed to hide the review.')
  }
}

export async function restoreReviewAction(reviewId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()
    await ModerationService.restoreReview(reviewId, admin.id)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    return failure(err, 'Failed to restore the review.')
  }
}

export async function approveClaimAction(claimId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()
    await ModerationService.approveClaim(claimId, admin.id)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    return failure(err, 'Failed to approve the claim.')
  }
}

export async function rejectClaimAction(claimId: string, reason: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()
    if (!reason.trim()) return { success: false, error: 'A reason is required to reject a claim.' }
    await ModerationService.rejectClaim(claimId, admin.id, reason.trim())
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    return failure(err, 'Failed to reject the claim.')
  }
}

function failure(err: unknown, fallback: string): ActionResult {
  if (err instanceof AuthorizationError) {
    return { success: false, error: err.message }
  }
  logger.error('Admin moderation action failed', {
    error: err instanceof Error ? err.message : err,
  })
  return { success: false, error: fallback }
}
