import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'
import { ModerationQueue } from '@/features/admin/moderation-queue'
import { ModerationService } from '@/lib/services/moderation'

export const metadata: Metadata = {
  title: 'Moderator Dashboard | Nyumbani',
  description: 'Internal administration and moderation console.',
}

// Queues must always reflect live data — never a stale prerender.
export const dynamic = 'force-dynamic'

/**
 * Moderator and Admin Dashboard.
 * Access control is 3-layered: middleware guards the route (Admin role),
 * every action re-verifies the role server-side, and RLS backs both. The
 * queues are real data — flagged reviews from the reports table and pending
 * landlord claims — with reversible, logged moderation actions.
 */
export default async function AdminDashboardPage() {
  const { flaggedReviews, pendingClaims } = await ModerationService.getQueues()

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-5xl">
          <header className="mb-lg border-b border-border-subtle pb-sm">
            <h1 className="text-title font-semibold">Moderator Console</h1>
            <p className="text-metadata text-text-muted">
              Review verification claims and flagged abuse reports. All actions are reversible and
              recorded in the moderation log.
            </p>
          </header>

          <ModerationQueue flaggedReviews={flaggedReviews} pendingClaims={pendingClaims} />
        </Container>
      </main>
    </div>
  )
}
