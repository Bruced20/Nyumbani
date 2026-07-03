'use client'

import React from 'react'
import { Container, Section, Stack } from '@ui/layout'
import { H2, Body } from '@ui/typography'
import { Button } from '@ui/button'
import { AlertOctagon } from 'lucide-react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Design System Error Page.
 * Catches application-level rendering errors inside the layout trees.
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  React.useEffect(() => {
    // observational trace hook
    console.error('Crashed: Application Boundary Caught Error:', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center py-xl bg-bg-primary min-h-[500px]">
      <Container className="max-w-md">
        <Section className="p-lg bg-bg-secondary border border-border-subtle rounded-symmetric shadow-sm text-center">
          <Stack gap="sm" className="items-center">
            <div className="h-12 w-12 bg-accent-coral/10 text-accent-coral rounded-pill flex items-center justify-center mb-xxs">
              <AlertOctagon size={24} />
            </div>
            <H2 className="font-bold">Something went wrong</H2>
            <Body className="text-text-muted text-[14px] leading-relaxed">
              A temporary runtime error occurred while processing page data. Our observability
              diagnostics have logged the details.
            </Body>
            <div className="flex gap-xs w-full mt-xs">
              <Button onClick={() => reset()} variant="primary" className="flex-1">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="flex-1"
              >
                Home
              </Button>
            </div>
          </Stack>
        </Section>
      </Container>
    </div>
  )
}
