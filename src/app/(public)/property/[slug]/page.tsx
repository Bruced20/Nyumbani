import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Dynamic Metadata generation for SEO optimization
export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Sunrise Apartments (${slug}) | Nyumbani`,
    description: `Read verified tenant ratings, noise levels, and water reliability for Sunrise Apartments with slug ${slug}.`,
  }
}

/**
 * Property Details Page.
 * Strictly adheres to the hierarchy of Decision 1:
 * 1. Property Images
 * 2. Property Name
 * 3. Verified Owner or Community Listing Badge
 * 4. Rent and House Type
 * 5. Property Health Score
 * 6. Quick Facts (Water, Internet, Security, Deposit, Parking, Road Access, Public Transport)
 * 7. AI Community Summary
 * 8. Community Ratings
 * 9. Resident Reviews
 * 10. Owner Responses
 */
export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params

  // Placeholder check: Trigger 404 if slug is empty
  if (!slug) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto p-md bg-bg-primary text-text-primary flex flex-col gap-md">
      {/* 1. Property Images (4:3 gallery placeholder) */}
      <section className="w-full aspect-[4/3] bg-bg-secondary border border-border-subtle rounded-symmetric flex items-center justify-center">
        <span className="text-text-muted">Image Gallery Carousel Placement</span>
      </section>

      {/* 2 & 3. Property Name and Verified Owner/Community Badge */}
      <section className="flex flex-col gap-xxs">
        <div className="flex items-center gap-xs">
          <h1 className="text-title font-semibold">Sunrise Apartments</h1>
          {/* Badge Placeholder: Verified Owner or Community Listing */}
          <span className="px-xs py-[2px] bg-accent-emerald/10 text-accent-emerald text-[11px] font-bold rounded-pill border border-accent-emerald/20">
            Verified Owner
          </span>
        </div>

        {/* 4. Rent and House Type */}
        <p className="text-body font-medium text-text-muted">
          Rent: <strong className="text-text-primary">25,000 - 32,000 KES</strong> • Type:{' '}
          <strong>2 Bedroom</strong>
        </p>
      </section>

      {/* 5. Property Health Score */}
      <section className="flex items-center gap-xs bg-bg-secondary p-sm rounded-symmetric border border-border-subtle">
        <div className="px-sm py-xxs bg-accent-emerald text-white font-bold text-subtitle rounded-soft">
          4.8
        </div>
        <div>
          <h3 className="font-semibold text-subtitle">Excellent Health Score</h3>
          <p className="text-metadata text-text-muted">
            Calculated from 14 verified resident evaluations
          </p>
        </div>
      </section>

      {/* 6. Quick Facts Grid (Water, Internet, Security, Deposit, Parking, Road Access, Public Transport) */}
      <section className="flex flex-col gap-xs">
        <h2 className="text-subtitle font-semibold">Quick Facts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-xs">
          {/* Fact items */}
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Water</span>
            <span className="font-medium text-[14px]">Borehole & Council</span>
          </div>
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Internet</span>
            <span className="font-medium text-[14px]">Safaricom Fibre, Zuku</span>
          </div>
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Security</span>
            <span className="font-medium text-[14px]">Gated, 24/7 Guard</span>
          </div>
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Deposit Refund</span>
            <span className="font-medium text-[14px]">Fully Refunded</span>
          </div>
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Parking</span>
            <span className="font-medium text-[14px]">1 Slot Assigned</span>
          </div>
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Road Access</span>
            <span className="font-medium text-[14px]">Tarmac Access</span>
          </div>
          <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle">
            <span className="block text-metadata text-text-muted">Public Transport</span>
            <span className="font-medium text-[14px]">5-Min Walk to Stage</span>
          </div>
        </div>
      </section>

      {/* 7. AI Community Summary (Decision 1: placed after quick facts) */}
      <section className="p-sm bg-bg-secondary border border-dashed border-brand-indigo/30 rounded-symmetric relative">
        <h3 className="text-metadata font-bold text-brand-indigo mb-xxs">AI Sentiment Summary</h3>
        <p className="text-body text-text-muted text-[14px]">
          Residents consistently report extremely high water reliability and stable internet access.
          However, Sunday mornings can be loud due to the proximity of a local church.
        </p>
      </section>

      {/* 8. Community Ratings (5-vector breakdown) */}
      <section className="flex flex-col gap-xs">
        <h2 className="text-subtitle font-semibold">Community Ratings</h2>
        {/* TODO: Add star distributions for Water, Security, Caretaker, Noise, Internet */}
        <div className="border border-border-subtle p-sm rounded-symmetric">
          <p className="text-text-muted text-[14px]">Vector rating bars placeholder...</p>
        </div>
      </section>

      {/* 9. Resident Reviews Timeline */}
      <section className="flex flex-col gap-sm">
        <h2 className="text-subtitle font-semibold">Resident Reviews</h2>
        {/* TODO: Map reviews list here. Ensure only role-based labels are rendered (No user PII) */}
        <div className="border border-border-subtle p-sm rounded-symmetric">
          <p className="text-text-muted text-[14px]">Chronological reviews feed placeholder...</p>
        </div>
      </section>

      {/* 10. Owner Responses */}
      <section className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric">
        <h3 className="font-semibold text-metadata mb-xxs">Owner & Management Responses</h3>
        <p className="text-body text-text-muted text-[14px]">
          Landlords and caretakers may reply to reviews to provide context or outline resolution
          plans.
        </p>
      </section>
    </main>
  )
}
