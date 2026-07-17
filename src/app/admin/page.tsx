import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'

export const metadata: Metadata = {
  title: 'Moderator Dashboard | Nyumbani',
  description: 'Internal administration and moderation console.',
}

/**
 * Moderator and Admin Dashboard.
 * Protected by Admin user role checks.
 * Sprint P0: standard Navbar shell (no marketing footer on internal console).
 */
export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-5xl">
          <header className="mb-lg border-b border-border-subtle pb-sm">
            <h1 className="text-title font-semibold">Moderator Console</h1>
            <p className="text-metadata text-text-muted">
              Review verification claims and flagged abuse reports
            </p>
          </header>

          {/* Admin Queues */}
          <div className="grid md:grid-cols-2 gap-lg">
            {/* Verification Claims Queue */}
            <section className="flex flex-col gap-xs">
              <h3 className="font-semibold text-[14px] text-text-muted">Landlord Claims (0)</h3>
              {/* TODO: Implement claim verification check and approval action call */}
              <p className="text-metadata text-text-muted">No pending claims in the queue.</p>
            </section>

            {/* Flagged Reviews Queue */}
            <section className="flex flex-col gap-xs md:border-l md:border-border-subtle md:pl-lg">
              <h3 className="font-semibold text-[14px] text-text-muted">Abuse Reports (0)</h3>
              {/* TODO: Implement review censoring or dismissal logic */}
              <p className="text-metadata text-text-muted">No pending abuse reports.</p>
            </section>
          </div>
        </Container>
      </main>
    </div>
  )
}
