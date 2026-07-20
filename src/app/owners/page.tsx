import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container, Grid, Stack } from '@ui/layout'
import { Display, H3, Body } from '@ui/typography'

export const metadata: Metadata = {
  title: 'Landlord Portal | Nyumbani',
  description: 'Claim your property listing and build trust with Kenyan renters.',
}

/**
 * Owners Hub Landing Page.
 * Sprint P0: standard Navbar/Footer page shell, widened content column,
 * and plain card containers (Section was injecting page-band padding).
 */
export default function OwnersLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-xl flex flex-col justify-center">
        <Container className="max-w-4xl flex flex-col gap-lg">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-xs">
            <Display className="mb-xs">Nyumbani Owner Hub</Display>
            <Body className="text-text-muted mb-lg">
              Claim your property listing to showcase verified details, respond directly to tenant
              reviews, and update vacancy status.
            </Body>
          </div>

          <Grid cols={2} gap="md" className="w-full items-stretch">
            {/* Onboarding block: Claiming properties */}
            <div className="p-md bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col justify-between shadow-sm">
              <Stack gap="xs" className="mb-md">
                <H3>Claim Existing Building</H3>
                <Body className="text-[14px] text-text-muted">
                  If your building already has reviews on Nyumbani, submit verification documents to
                  claim ownership and manage replies.
                </Body>
              </Stack>
              <Link
                href="/owners/dashboard"
                className="w-full text-center py-[10px] bg-text-primary text-bg-primary font-semibold rounded-soft hover:bg-opacity-90 transition-colors text-[14px]"
              >
                Claim Property
              </Link>
            </div>

            {/* Onboarding block: Registering new properties */}
            <div className="p-md bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col justify-between shadow-sm">
              <Stack gap="xs" className="mb-md">
                <H3>List New Property</H3>
                <Body className="text-[14px] text-text-muted">
                  Create a new listing for your property, add specifications, upload layout images,
                  and apply for a verified badge.
                </Body>
              </Stack>
              <Link
                href="/owners/dashboard"
                className="w-full text-center py-[10px] bg-brand-primary text-white font-semibold rounded-soft hover:bg-opacity-95 transition-colors text-[14px]"
              >
                Get Started
              </Link>
            </div>
          </Grid>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
