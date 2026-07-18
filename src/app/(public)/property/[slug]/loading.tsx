import React from 'react'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'
import { Skeleton } from '@ui/feedback'

/**
 * Property detail route loading skeleton.
 * Mirrors the magazine layout: hero gallery + 8/4 content-sidebar split.
 */
export default function PropertyLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-6xl flex flex-col gap-lg">
          {/* Hero gallery */}
          <Skeleton className="w-full aspect-[21/9] rounded-symmetric" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Main content */}
            <div className="lg:col-span-8 flex flex-col gap-lg">
              <div className="flex flex-col gap-sm">
                <Skeleton className="h-9 w-2/3" />
                <div className="flex gap-xs">
                  <Skeleton className="h-6 w-28 rounded-pill" />
                  <Skeleton className="h-6 w-32 rounded-pill" />
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              {/* Quick facts grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-xxs">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-px w-full" />

              {/* Review blocks */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-sm py-sm">
                  <div className="flex items-center gap-sm">
                    <Skeleton className="h-9 w-9 rounded-pill" />
                    <div className="flex flex-col gap-xxs">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-sm p-lg bg-bg-secondary border border-border-subtle rounded-symmetric shadow-sm">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-11 w-full rounded-soft mt-xs" />
                <Skeleton className="h-11 w-full rounded-soft" />
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
