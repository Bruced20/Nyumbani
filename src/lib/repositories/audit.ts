import { createClient } from '../supabase/server'
import { Database } from '@/types/database.types'

type AuditInsert = Database['public']['Tables']['audit_logs']['Insert']

/**
 * Audit Logs Repository.
 * Records administrative / integrity-relevant actions (reports filed, reviews
 * moderated, claims resolved). Writes are best-effort: an audit failure must
 * never break the user-facing action, so callers wrap this in try/catch.
 */
export const AuditRepository = {
  async record(entry: AuditInsert): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('audit_logs').insert(entry)
    if (error) {
      // Surface to the caller, which decides whether to swallow it.
      throw error
    }
  },
}
