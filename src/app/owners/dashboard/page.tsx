import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container, Stack, Grid } from '@ui/layout'
import { H1, H4, Body } from '@ui/typography'
import { Button } from '@ui/button'

export const metadata: Metadata = {
  title: 'Landlord Dashboard | Nyumbani',
  description: 'Manage your claimed properties and respond to resident reviews.',
}

/**
 * Verified Landlords Dashboard.
 * Restricted to authenticated owner accounts.
 * Sprint P0: standard Navbar/Footer page shell and plain panel containers
 * (Section was injecting page-band padding).
 */
export default function OwnerDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-5xl">
          <header className="flex justify-between items-center mb-lg border-b border-border-subtle pb-sm flex-wrap gap-sm">
            <Stack gap="xxs">
              <H1 className="leading-tight">Owner Dashboard</H1>
              <Body className="text-text-muted text-[15px]">
                Manage your properties and engagement
              </Body>
            </Stack>

            <Button variant="primary" className="text-[14px] px-sm py-xs h-auto">
              Add New Property
            </Button>
          </header>

          {/* Dashboard sections layout */}
          <Grid cols={3} gap="lg">
            {/* Side Panel: Claim status */}
            <div className="md:col-span-1 flex flex-col gap-xs">
              <H4 className="text-text-muted font-semibold">Claim Status</H4>
              <Body className="text-[14px] text-text-muted mt-xxs">No pending claims found.</Body>
            </div>

            {/* Main Panel: Claimed Properties */}
            <div className="md:col-span-2 flex flex-col gap-lg">
              <div className="flex flex-col gap-xs">
                <H4 className="text-text-muted font-semibold">Your Properties</H4>
                <Body className="text-[14px] text-text-muted mt-xxs">
                  You have not claimed any properties yet.
                </Body>
              </div>

              <div className="flex flex-col gap-xs pt-sm border-t border-border-subtle">
                <H4 className="text-text-muted font-semibold">Recent Reviews</H4>
                <Body className="text-[14px] text-text-muted mt-xxs">
                  No recent reviews received.
                </Body>
              </div>
            </div>
          </Grid>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
