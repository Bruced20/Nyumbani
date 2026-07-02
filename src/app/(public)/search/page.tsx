import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Rentals | Nyumbani',
  description: 'Find verified rental property ratings and scores in Nairobi.',
}

/**
 * Search results and listings discovery page.
 * Implements a split pane layout on desktop (List view on left, Static Map on right).
 */
export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary p-md lg:flex-row gap-md">
      {/* Left Column: Properties List */}
      <div className="flex-1 flex flex-col gap-sm max-w-xl">
        <header className="flex flex-col gap-xxs mb-sm">
          <h1 className="text-title font-semibold">Search Results</h1>
          <p className="text-metadata text-text-muted">
            Showing properties matching your search criteria
          </p>
        </header>

        {/* TODO: Implement horizontal filters carousel component here */}
        {/* TODO: Render a list of Property Card components here */}
        <div className="border border-dashed border-border-subtle p-lg rounded-symmetric text-center">
          <p className="text-text-muted">Property cards list placeholder...</p>
        </div>
      </div>

      {/* Right Column: Map Preview Area */}
      <div className="flex-1 min-h-[400px] bg-bg-secondary rounded-symmetric border border-border-subtle relative overflow-hidden flex items-center justify-center p-md">
        {/* Decision 2: Load lightweight static map preview by default */}
        <div className="text-center flex flex-col items-center gap-xs">
          <span className="text-text-muted text-metadata">Static Map Preview</span>
          {/* TODO: Implement map toggle logic */}
          <button className="px-sm py-xxs bg-brand-indigo text-white font-medium rounded-soft hover:bg-opacity-95 transition-colors cursor-pointer">
            Open Interactive Map
          </button>
        </div>
      </div>
    </div>
  )
}
