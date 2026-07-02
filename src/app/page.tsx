import Link from 'next/link'

/**
 * Nyumbani Homepage.
 * Focus: High-intent location search and user trust education.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-bg-primary text-text-primary">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-border-subtle bg-bg-secondary pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:p-4">
          Nyumbani - Rental Intelligence Platform for Kenya
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-bg-primary via-bg-primary lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link href="/owners" className="hover:underline text-text-muted">
            Landlord Portal &rarr;
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-xxs max-w-2xl text-center">
        <h1 className="text-display font-bold tracking-tight mb-xs">
          What is it actually like to live here?
        </h1>
        <p className="text-body text-text-muted mb-lg">
          Nyumbani is Kenya’s community-driven rental transparency network. Discover verified
          details about water reliability, security, noise, and internet before signing a lease.
        </p>

        {/* TODO: Implement global search overlay component (Search Input) */}
        <div className="w-full max-w-md p-sm bg-bg-secondary rounded-symmetric border border-border-subtle shadow-md cursor-pointer hover:border-brand-indigo transition-colors duration-200">
          <span className="text-text-muted">
            Search by neighborhood or apartment name (e.g. Westlands, Kilimani)...
          </span>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left gap-md">
        <Link
          href="/search"
          className="group rounded-symmetric border border-transparent px-5 py-4 transition-colors hover:border-border-subtle hover:bg-bg-secondary"
        >
          <h2 className="mb-3 text-subtitle font-semibold">
            Explore Rentals{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &rarr;
            </span>
          </h2>
          <p className="m-0 text-metadata text-text-muted">
            Browse Nairobi apartment ratings and read structured tenant feedback.
          </p>
        </Link>

        <Link
          href="/review/new"
          className="group rounded-symmetric border border-transparent px-5 py-4 transition-colors hover:border-border-subtle hover:bg-bg-secondary"
        >
          <h2 className="mb-3 text-subtitle font-semibold">
            Add a Review{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &rarr;
            </span>
          </h2>
          <p className="m-0 text-metadata text-text-muted">
            Share anonymous insights about your current or former apartment.
          </p>
        </Link>

        <Link
          href="/about"
          className="group rounded-symmetric border border-transparent px-5 py-4 transition-colors hover:border-border-subtle hover:bg-bg-secondary"
        >
          <h2 className="mb-3 text-subtitle font-semibold">
            Our Methodology{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &rarr;
            </span>
          </h2>
          <p className="m-0 text-metadata text-text-muted">
            Learn how we compute the Property Health Score and protect user privacy.
          </p>
        </Link>
      </div>
    </main>
  )
}
