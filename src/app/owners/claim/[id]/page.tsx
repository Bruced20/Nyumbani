import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container } from '@ui/layout'

interface ClaimListingPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ClaimListingPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Claim Property | Nyumbani`,
    description: `Claim listing verification for property ID ${id}`,
  }
}

/**
 * Landlord property verification claim submission route.
 * Sprint P0: standard Navbar/Footer page shell; form card widened to a
 * comfortable reading width instead of a floating 448px island.
 */
export default async function ClaimListingPage({ params }: ClaimListingPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-xl flex flex-col justify-center">
        <Container className="max-w-[36rem]">
          <div className="border border-border-subtle p-lg rounded-symmetric bg-bg-secondary shadow-md">
            <header className="mb-sm border-b border-border-subtle pb-xs">
              <h1 className="text-subtitle font-semibold">Claim Ownership</h1>
              <p className="text-metadata text-text-muted">Property ID: {id}</p>
            </header>

            {/* Claim Submission Form */}
            {/* TODO: Implement document file upload to claims-bucket and action call */}
            <div className="flex flex-col gap-sm">
              <div className="flex flex-col gap-xxs">
                <label className="text-metadata text-text-muted font-medium">
                  Upload Verification Document
                </label>
                <p className="text-[12px] text-text-muted">
                  Submit a scanned Nairobi Water bill, KPLC token receipt, title deed, or legal
                  management license showing matching address details.
                </p>
                <input
                  type="file"
                  className="w-full p-xs bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-primary mt-xxs"
                  disabled
                />
              </div>

              <button
                className="w-full py-xxs bg-brand-primary text-white font-medium rounded-soft text-[14px] disabled:opacity-50"
                disabled
              >
                Submit Claim Verification
              </button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
