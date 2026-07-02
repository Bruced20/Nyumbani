import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Methodology & Anonymity | Nyumbani',
  description: 'How Nyumbani calculates the Property Health Score and protects your privacy.',
}

/**
 * About / Transparency Page.
 * Explains scoring calculations, RLS privacy design, and Google authentication roles.
 */
export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto p-md bg-bg-primary text-text-primary min-h-screen flex flex-col gap-md">
      <header className="border-b border-border-subtle pb-sm">
        <h1 className="text-title font-semibold">Our Methodology & Privacy Guarantees</h1>
        <p className="text-metadata text-text-muted">
          How Nyumbani ensures trust and rental transparency in Kenya
        </p>
      </header>

      {/* Trust guarantees explanation */}
      <section className="flex flex-col gap-xs">
        <h3 className="font-semibold text-subtitle">1. Default Contributor Anonymity</h3>
        <p className="text-body text-text-muted text-[14px]">
          We believe renters have a right to share their experiences without fear of landlord
          retaliation or broker blacklisting. Google Sign-In is only required to verify unique
          identities, mitigate spam, and support moderation. Your email, Google profile picture, and
          full name are completely hidden and encrypted. Public reviews only display role tags like{' '}
          <strong>Current Resident</strong> or <strong>Former Resident</strong>.
        </p>
      </section>

      {/* Property health score calculations */}
      <section className="flex flex-col gap-xs">
        <h3 className="font-semibold text-subtitle">2. Property Health Score Calculation</h3>
        <p className="text-body text-text-muted text-[14px]">
          Each property is assigned a cached overall score from 1.0 to 5.0. The score is computed
          automatically on PostgreSQL database triggers whenever a new unmoderated review is
          submitted. We calculate the arithmetic mean of three vectors:
          <strong>Water reliability</strong>, <strong>security</strong>, and{' '}
          <strong>caretaker responsiveness</strong>.
        </p>
      </section>

      {/* Verification standards */}
      <section className="flex flex-col gap-xs">
        <h3 className="font-semibold text-subtitle">3. Verification Badges</h3>
        <p className="text-body text-text-muted text-[14px]">
          A <strong>Verified Owner</strong> badge indicates the landlord or property manager has
          uploaded valid ownership documentation (such as a Nairobi Water bill or KPLC statement)
          which has been manually audited and approved by Nyumbani moderators.
        </p>
      </section>
    </main>
  )
}
