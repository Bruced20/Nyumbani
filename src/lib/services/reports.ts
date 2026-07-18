import { ReportRepository } from '../repositories/reports'
import { AuditRepository } from '../repositories/audit'
import { mapReportRow, Report } from '../mappers'

/**
 * Reports Service.
 * Files moderation reports and records an audit trail. Reports are the feedstock
 * for the admin moderation queue (Slice 4).
 */
export const ReportService = {
  async submitReport(payload: {
    reviewId: string
    reporterId: string
    reason: string
  }): Promise<Report> {
    const row = await ReportRepository.create({
      review_id: payload.reviewId,
      reporter_id: payload.reporterId,
      reason: payload.reason,
    })

    // Best-effort audit — never let logging break the report itself.
    try {
      await AuditRepository.record({
        actor_id: payload.reporterId,
        action: 'report.create',
        entity: 'review',
        entity_id: payload.reviewId,
        metadata: { reason: payload.reason },
      })
    } catch {
      // ignore audit write failures
    }

    return mapReportRow(row)
  },
}
