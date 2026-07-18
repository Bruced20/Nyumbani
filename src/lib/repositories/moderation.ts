import { createAdminClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError } from '../errors'

type ReviewRow = Database['public']['Tables']['reviews']['Row']
type ReportRow = Database['public']['Tables']['reports']['Row']
type ClaimRow = Database['public']['Tables']['claims']['Row']
type ModerationLogInsert = Database['public']['Tables']['moderation_logs']['Insert']

/**
 * Moderation Repository.
 * Uses the service-role client for privileged reads/writes (bypasses RLS to see
 * hidden reviews and unresolved reports). MUST only be called from server code
 * that has already passed requireAdmin(). RLS remains as defense-in-depth.
 */
export const ModerationRepository = {
  /** Unresolved reports, newest first. */
  async listUnresolvedReports(): Promise<ReportRow[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
    if (error) throw new DatabaseError('Failed to list reports.', { rawError: error })
    return data || []
  },

  /** Reviews by id set (includes hidden ones — service role bypasses the filter). */
  async listReviewsByIds(ids: string[]): Promise<ReviewRow[]> {
    if (ids.length === 0) return []
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('reviews').select('*').in('id', ids)
    if (error) throw new DatabaseError('Failed to list reviews.', { rawError: error })
    return data || []
  },

  /** Pending landlord claims, newest first. */
  async listPendingClaims(): Promise<ClaimRow[]> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('status', 'Pending')
      .order('created_at', { ascending: false })
    if (error) throw new DatabaseError('Failed to list claims.', { rawError: error })
    return data || []
  },

  async getReviewById(id: string): Promise<ReviewRow | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('reviews').select('*').eq('id', id).maybeSingle()
    if (error) throw new DatabaseError('Failed to fetch review.', { rawError: error })
    return data
  },

  /** Minimal property display context (name + slug) by id. */
  async getPropertyBrief(propertyId: string): Promise<{ name: string; slug: string } | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('properties')
      .select('name, slug')
      .eq('id', propertyId)
      .maybeSingle()
    if (error) throw new DatabaseError('Failed to fetch property brief.', { rawError: error })
    return data
  },

  /** Set a review's moderation state (hide/restore) with accountability fields. */
  async setReviewModeration(
    reviewId: string,
    hidden: boolean,
    moderatorId: string,
    reason: string | null
  ): Promise<ReviewRow> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('reviews')
      .update({
        is_moderated: hidden,
        moderated_at: hidden ? new Date().toISOString() : null,
        moderated_by: hidden ? moderatorId : null,
        moderation_reason: hidden ? reason : null,
      })
      .eq('id', reviewId)
      .select('*')
      .single()
    if (error) throw new DatabaseError('Failed to update review moderation.', { rawError: error })
    return data
  },

  /** Mark every report on a review resolved (called when the review is actioned). */
  async resolveReportsForReview(reviewId: string): Promise<void> {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('reports')
      .update({ is_resolved: true })
      .eq('review_id', reviewId)
    if (error) throw new DatabaseError('Failed to resolve reports.', { rawError: error })
  },

  async setClaimStatus(
    claimId: string,
    status: 'Approved' | 'Rejected',
    rejectionReason: string | null
  ): Promise<ClaimRow> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('claims')
      .update({ status, rejection_reason: rejectionReason })
      .eq('id', claimId)
      .select('*')
      .single()
    if (error) throw new DatabaseError('Failed to update claim.', { rawError: error })
    return data
  },

  /** On claim approval, mark the property verified and record the owner. */
  async markPropertyVerified(propertyId: string, ownerId: string): Promise<void> {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('properties')
      .update({ is_verified: true, verified_owner_id: ownerId })
      .eq('id', propertyId)
    if (error) throw new DatabaseError('Failed to verify property.', { rawError: error })
  },

  /** Append an accountable moderation-log entry. */
  async log(entry: ModerationLogInsert): Promise<void> {
    const supabase = createAdminClient()
    const { error } = await supabase.from('moderation_logs').insert(entry)
    if (error) throw new DatabaseError('Failed to write moderation log.', { rawError: error })
  },
}
