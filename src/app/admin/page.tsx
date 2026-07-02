import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moderator Dashboard | Nyumbani',
  description: 'Internal administration and moderation console.',
}

/**
 * Moderator and Admin Dashboard.
 * Protected by Admin user role checks.
 */
export default function AdminDashboardPage() {
  return (
    <main className="max-w-5xl mx-auto p-md bg-bg-primary text-text-primary min-h-screen">
      <header className="mb-md border-b border-border-subtle pb-sm">
        <h1 className="text-title font-semibold">Moderator Console</h1>
        <p className="text-metadata text-text-muted">
          Review verification claims and flagged abuse reports
        </p>
      </header>

      {/* Admin Queues */}
      <div className="grid md:grid-cols-2 gap-md">
        {/* Verification Claims Queue */}
        <section className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
          <h3 className="font-semibold text-subtitle mb-xs">Landlord Claims ({0})</h3>
          {/* TODO: Implement claim verification check and approval action call */}
          <p className="text-metadata text-text-muted">No pending claims in the queue.</p>
        </section>

        {/* Flagged Reviews Queue */}
        <section className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
          <h3 className="font-semibold text-subtitle mb-xs">Abuse Reports ({0})</h3>
          {/* TODO: Implement review censoring or dismissal logic */}
          <p className="text-metadata text-text-muted">No pending abuse reports.</p>
        </section>
      </div>
    </main>
  )
}
