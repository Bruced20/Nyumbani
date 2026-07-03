import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container } from '@ui/layout'
import { ReviewWizard } from '@/features/reviews/review-wizard'
import { PropertyService } from '@/lib/services/properties'

export const metadata: Metadata = {
  title: 'Write a Review | Nyumbani',
  description: 'Share your structured rental experience anonymously with the Kenyan community.',
}

/**
 * Conversational Review Submission Page.
 * Loads the properties list on the server and mounts the multi-screen Review Wizard.
 */
export default async function NewReviewPage() {
  const properties = await PropertyService.getAllPropertiesBrief()

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-xl px-sm">
        <Container className="max-w-md">
          <ReviewWizard properties={properties} />
        </Container>
      </main>

      <Footer />
    </div>
  )
}
