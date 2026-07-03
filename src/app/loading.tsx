import React from 'react'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'
import { LoadingSpinner } from '@ui/feedback'

/**
 * Design System global loading suspension handler.
 */
export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-xl">
        <Container className="flex flex-col items-center justify-center gap-xs">
          <LoadingSpinner size="lg" />
          <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">
            Loading rental intelligence...
          </span>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
