import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Landlord Dashboard | Nyumbani',
  description: 'Manage your claimed properties and respond to resident reviews.',
}

/**
 * Verified Landlords Dashboard.
 * Restricted to authenticated owner accounts.
 */
export default function OwnerDashboardPage() {
  return (
    <main className="max-w-5xl mx-auto p-md bg-bg-primary text-text-primary min-h-screen">
      <header className="flex justify-between items-center mb-md border-b border-border-subtle pb-sm">
        <div>
          <h1 className="text-title font-semibold">Owner Dashboard</h1>
          <p className="text-metadata text-text-muted">Manage your properties and engagement</p>
        </div>

        {/* TODO: Add property creation action trigger */}
        <button className="px-sm py-xxs bg-brand-indigo text-white font-medium rounded-soft text-[14px]">
          Add New Property
        </button>
      </header>

      {/* Dashboard sections layout */}
      <div className="grid md:grid-cols-3 gap-md">
        {/* Side Panel: Claim status */}
        <section className="md:col-span-1 p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
          <h3 className="font-semibold text-subtitle mb-xs">Claim Status</h3>
          {/* TODO: Render a list of pending/approved claims here */}
          <p className="text-metadata text-text-muted">No pending claims found.</p>
        </section>

        {/* Main Panel: Claimed Properties */}
        <section className="md:col-span-2 flex flex-col gap-sm">
          <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
            <h3 className="font-semibold text-subtitle mb-xs">Your Properties</h3>
            {/* TODO: Render a list of claimed properties with vacancy status editing triggers */}
            <p className="text-metadata text-text-muted">
              You have not claimed any properties yet.
            </p>
          </div>

          <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
            <h3 className="font-semibold text-subtitle mb-xs">Recent Reviews</h3>
            {/* TODO: Render reviews matching owned properties to write replies */}
            <p className="text-metadata text-text-muted">No recent reviews received.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
