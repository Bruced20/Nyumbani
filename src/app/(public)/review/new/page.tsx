import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write a Review | Nyumbani',
  description: 'Share your structured rental experience anonymously with the Kenyan community.',
}

/**
 * Conversational Review Submission Page.
 * Implements a wizard displaying one question per screen to minimize friction.
 *
 * Flow:
 * - Screen 1: Property Search
 * - Screen 2: Water reliability (1-5 stars)
 * - Screen 3: Security (1-5 stars)
 * - Screen 4: Caretaker responsiveness (1-5 stars)
 * - Screen 5: Recommendation status (Yes / Maybe / No)
 * - Screen 6: Written text area (for objective facts)
 * - Screen 7: Identity role selector (e.g. Current Resident) & Google Login
 */
export default function NewReviewPage() {
  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-md bg-bg-primary text-text-primary">
      <div className="border border-border-subtle p-lg rounded-symmetric bg-bg-secondary shadow-md">
        {/* Header Indicator */}
        <header className="flex justify-between items-center mb-md border-b border-border-subtle pb-xs">
          <span className="text-metadata text-text-muted">Step 1 of 7</span>
          <span className="text-metadata text-brand-indigo font-semibold">
            Conversational Review
          </span>
        </header>

        {/* Wizard Question Display Container */}
        {/* TODO: Implement client component state container for wizard step navigation */}
        <div className="min-h-[200px] flex flex-col justify-center">
          <h2 className="text-subtitle font-semibold mb-xs">Select your apartment building</h2>
          <p className="text-metadata text-text-muted mb-sm">
            Search for the building name to attach your review.
          </p>

          {/* TODO: Add auto-complete property search selector */}
          <input
            type="text"
            placeholder="Search apartment name..."
            className="w-full p-xs bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-indigo"
            disabled
          />
        </div>

        {/* Wizard Footer Navigation Controls */}
        <footer className="flex justify-between items-center mt-md pt-sm border-t border-border-subtle">
          <button
            className="px-sm py-xxs border border-border-subtle rounded-soft text-text-muted text-[14px] disabled:opacity-50"
            disabled
          >
            Back
          </button>

          <button className="px-sm py-xxs bg-brand-indigo text-white font-medium rounded-soft text-[14px] hover:bg-opacity-95 transition-colors">
            Next
          </button>
        </footer>
      </div>
    </main>
  )
}
