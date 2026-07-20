import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container } from '@ui/layout'
import { H1 } from '@ui/typography'
import { PropertyForm } from '@/features/properties/property-form'

export const metadata: Metadata = {
  title: 'Add a Property | Nyumbani',
  description:
    'Know a building that is not on Nyumbani yet? Add it so residents can review it and renters can find it.',
}

/**
 * Community property submission page.
 * Auth is enforced by middleware; anyone signed in can add a building. New
 * listings start as community submitted until the owner claims them.
 */
export default function NewPropertyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-3xl flex flex-col gap-md">
          <header className="flex flex-col gap-xxs">
            <H1>Add a property</H1>
            <p className="text-[15px] text-text-muted leading-relaxed">
              Know a building that is not on Nyumbani yet? Add it here so residents can review it
              and renters can find it. You do not need to be the owner.
            </p>
          </header>

          <PropertyForm />
        </Container>
      </main>

      <Footer />
    </div>
  )
}
