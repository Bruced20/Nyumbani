import { createClient } from '../supabase/server'
import { AuthorizationError } from '../errors'

/**
 * Server-side admin authorization — layer 2 of Nyumbani's 3-layer RBAC.
 *
 *   Layer 1: middleware/route protection (src/middleware.ts guards /admin).
 *   Layer 2: this check, called at the top of every privileged server action.
 *   Layer 3: Supabase RLS policies on each table.
 *
 * Never rely on the middleware alone — server actions can be invoked directly,
 * so each one must re-verify the caller's Admin role against the database. The
 * service-role client (createAdminClient) is only used AFTER this passes, and
 * only from trusted server code; its key is never exposed to the browser.
 */
export async function requireAdmin(): Promise<{ id: string }> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new AuthorizationError('You must be signed in to perform this action.')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Admin') {
    throw new AuthorizationError('Administrator privileges are required.')
  }

  return { id: user.id }
}
