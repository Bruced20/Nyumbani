import React from 'react'
import Link from 'next/link'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container, Section, Stack } from '@ui/layout'
import { H2, Body } from '@ui/typography'
import { Button } from '@ui/button'
import { AlertCircle } from 'lucide-react'

/**
 * Design System 404 Page.
 * Returns clean layout when routes cannot be resolved.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-xl">
        <Container className="max-w-md">
          <Section className="p-lg bg-bg-secondary border border-border-subtle rounded-symmetric shadow-sm text-center">
            <Stack gap="sm" className="items-center">
              <div className="h-12 w-12 bg-brand-primary/10 text-brand-primary rounded-pill flex items-center justify-center mb-xxs">
                <AlertCircle size={24} />
              </div>
              <H2>Page Not Found</H2>
              <Body className="text-text-muted text-[14px] leading-relaxed">
                The listing, review search, or resource you are looking for does not exist or has
                been archived by our moderation team.
              </Body>
              <div className="w-full mt-xs">
                <Link href="/" passHref className="w-full">
                  <Button variant="primary" className="w-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </Stack>
          </Section>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
