import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Landlord Portal | Nyumbani',
  description: 'Claim your property listing and build trust with Kenyan renters.',
}

/**
 * Owners Hub Landing Page.
 * Onboards landlords by explaining verification benefits and claimed listing advantages.
 */
export default function OwnersLandingPage() {
  return (
    <main className="max-w-4xl mx-auto p-md bg-bg-primary text-text-primary min-h-screen flex flex-col justify-center gap-md">
      <div className="text-center max-w-xl mx-auto flex flex-col gap-xxs">
        <h1 className="text-display font-bold tracking-tight mb-xs">Nyumbani Owner Hub</h1>
        <p className="text-body text-text-muted mb-lg">
          Claim your property listing to showcase verified details, respond directly to tenant
          reviews, and update vacancy status.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-md items-stretch max-w-2xl mx-auto w-full">
        {/* Onboarding block: Claiming properties */}
        <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-subtitle mb-xxs">Claim Existing Building</h3>
            <p className="text-metadata text-text-muted mb-sm">
              If your building already has reviews on Nyumbani, submit verification documents to
              claim ownership and manage replies.
            </p>
          </div>
          <Link
            href="/owners/dashboard"
            className="w-full text-center py-xxs bg-text-primary text-bg-primary font-medium rounded-soft hover:bg-opacity-90 transition-colors"
          >
            Claim Property
          </Link>
        </div>

        {/* Onboarding block: Registering new properties */}
        <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-subtitle mb-xxs">List New Property</h3>
            <p className="text-metadata text-text-muted mb-sm">
              Create a new listing for your property, add specifications, upload layout images, and
              unlock verified badge status.
            </p>
          </div>
          {/* TODO: Add logic to trigger Google login and navigate to property creation */}
          <Link
            href="/owners/dashboard"
            className="w-full text-center py-xxs bg-brand-indigo text-white font-medium rounded-soft hover:bg-opacity-95 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}
