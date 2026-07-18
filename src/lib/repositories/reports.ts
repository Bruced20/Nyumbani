import { createClient, createStaticClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError, DuplicateError, PG_UNIQUE_VIOLATION } from '../errors'

type ReportRow = Database['public']['Tables']['reports']['Row']
type ReportInsert = Database['public']['Tables']['reports']['Insert']

/**
 * Reports Database Repository.
 * Reports are private moderation feedstock: only the reporter and admins can read
 * them (enforced by RLS). Inserts are subject to a unique(review_id, reporter_id)
 * index so a user cannot report the same review twice.
 */
export const ReportRepository = {
  async create(report: ReportInsert): Promise<ReportRow> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('reports').insert(report).select('*').single()

    if (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new DuplicateError('You have already reported this review.')
      }
      throw new DatabaseError('Failed to file report.', { rawError: error })
    }
    return data
  },

  /** Admin-only listing of unresolved reports (RLS restricts to admins). */
  async findUnresolved(): Promise<ReportRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })

    if (error) {
      throw new DatabaseError('Failed to fetch reports.', { rawError: error })
    }
    return data || []
  },
}
