import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container, Stack, Divider } from '@ui/layout'
import { H1, H3, Body } from '@ui/typography'

export const metadata: Metadata = {
  title: 'Methodology & Anonymity | Nyumbani',
  description: 'How Nyumbani calculates the Property Health Score and protects your privacy.',
}

/**
 * About / Transparency Page.
 * Sprint P0: standard Navbar/Footer page shell; plain subsection containers
 * (Section was injecting page-band padding on top of the Stack gap).
 */
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-3xl">
          <Stack gap="lg">
            {/* Header */}
            <header className="border-b border-border-subtle pb-sm">
              <H1 className="leading-tight">Our Methodology &amp; Privacy Guarantees</H1>
              <Body className="text-text-muted text-[15px] mt-xxs">
                How Nyumbani ensures trust and rental transparency in Kenya
              </Body>
            </header>

            {/* 1. Default Contributor Anonymity */}
            <div className="flex flex-col gap-xs">
              <H3>1. Default Contributor Anonymity</H3>
              <Body className="text-text-muted/90 text-[14px]">
                We believe renters have a right to share their experiences without fear of landlord
                retaliation or broker blacklisting. Google Sign-In is only required to verify unique
                identities, mitigate spam, and support moderation. Your email, Google profile
                picture, and full name are completely hidden and encrypted. Public reviews only
                display role tags like{' '}
                <strong className="font-semibold text-text-primary">Current Resident</strong> or{' '}
                <strong className="font-semibold text-text-primary">Former Resident</strong>.
              </Body>
            </div>

            <Divider />

            {/* 2. Property Health Score Calculation */}
            <div className="flex flex-col gap-xs">
              <H3>2. Property Health Score Calculation</H3>
              <Body className="text-text-muted/90 text-[14px]">
                Each property is assigned a cached overall score from 1.0 to 5.0. The score is
                computed automatically on PostgreSQL database triggers whenever a new unmoderated
                review is submitted. We calculate the arithmetic mean of three vectors:{' '}
                <strong className="font-semibold text-text-primary">Water reliability</strong>,{' '}
                <strong className="font-semibold text-text-primary">security</strong>, and{' '}
                <strong className="font-semibold text-text-primary">
                  caretaker responsiveness
                </strong>
                .
              </Body>
            </div>

            <Divider />

            {/* 3. Verification Badges */}
            <div className="flex flex-col gap-xs">
              <H3>3. Verification Badges</H3>
              <Body className="text-text-muted/90 text-[14px]">
                A <strong className="font-semibold text-text-primary">Verified Owner</strong> badge
                indicates the landlord or property manager has uploaded valid ownership
                documentation (such as a Nairobi Water bill or KPLC statement) which has been
                manually audited and approved by Nyumbani moderators.
              </Body>
            </div>
          </Stack>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
