import React from 'react'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container, Section, Grid, Stack } from '@ui/layout'
import { Display, H1, H2, Body } from '@ui/typography'
import { PropertyCard } from '@ui/card'
import { SearchBar } from '@/features/properties/search-bar'
import { PropertyService } from '@/lib/services/properties'
import { ShieldCheck, Eye, Sparkles } from 'lucide-react'

/**
 * Public Discovery Homepage.
 * Redesigned to support Product Design System v2 (Premium Experience).
 */
export default async function Home() {
  const featuredProperties = await PropertyService.getFeaturedProperties()

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar Header */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Search Section (Spacious & Editorial) */}
        <Section className="bg-transparent py-xl md:py-xl flex items-center justify-center">
          <Container className="flex flex-col items-center text-center max-w-3xl gap-sm">
            <Display className="text-display max-w-2xl font-bold tracking-tight text-text-primary">
              What is it actually like to live here?
            </Display>
            <Body className="text-text-muted text-[18px] max-w-2xl leading-relaxed mt-xxs mb-md">
              Nyumbani is Kenya’s community-driven rental intelligence network. Discover verified
              details about water reliability, security, and deposit refunds before signing a lease.
            </Body>

            {/* Embedded Search Bar Component */}
            <div className="w-full max-w-xl shadow-md rounded-symmetric">
              <SearchBar />
            </div>
          </Container>
        </Section>

        {/* 2. Featured Properties Section */}
        <Section className="py-lg bg-transparent border-t border-border-subtle">
          <Container>
            <div className="flex flex-col gap-xxs mb-lg">
              <H1 className="font-bold text-text-primary tracking-tight">Featured Properties</H1>
              <Body className="text-text-muted text-[15px]">
                Explore highly-rated Kenyan listings with active tenant reviews
              </Body>
            </div>

            <Grid cols={3} gap="md">
              {featuredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  name={prop.name}
                  neighborhood={prop.neighborhood}
                  rentMin={prop.rentMin}
                  rentMax={prop.rentMax}
                  houseType={prop.houseType}
                  healthScore={prop.healthScore}
                  isVerified={prop.isVerified}
                  imageUrl={prop.images?.[0]}
                  waterRating={
                    prop.waterRating === 'Excellent' ? 5 : prop.waterRating === 'Good' ? 4 : 3
                  }
                  securityRating={
                    prop.securityRating === 'Excellent' ? 5 : prop.securityRating === 'Good' ? 4 : 3
                  }
                  caretakerRating={prop.healthScore >= 4 ? 4.5 : 3.5}
                />
              ))}
            </Grid>
          </Container>
        </Section>

        {/* 3. "How Nyumbani Works" Section (Alternating Pure White background) */}
        <Section className="bg-bg-secondary border-t border-border-subtle py-lg">
          <Container>
            <div className="flex flex-col gap-xxs mb-lg text-center max-w-xl mx-auto">
              <H2 className="font-bold text-text-primary tracking-tight text-[24px]">
                How Nyumbani Works
              </H2>
              <Body className="text-text-muted text-[15px] leading-relaxed">
                Built on transparency, anonymity, and manual verification to guarantee renter trust.
              </Body>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-start pt-sm">
              {/* Step 1 */}
              <Stack gap="xs" className="items-center text-center px-sm">
                <div className="h-14 w-14 bg-brand-indigo/5 text-brand-indigo rounded-pill flex items-center justify-center shadow-sm border border-brand-indigo/10">
                  <Eye size={24} />
                </div>
                <h3 className="font-bold text-[16px] text-text-primary mt-sm">
                  1. Search Anonymously
                </h3>
                <p className="text-[14px] text-text-muted leading-relaxed mt-xxs">
                  Browse apartment metrics and resident evaluations without ever needing to create
                  an account. No SMS paywalls.
                </p>
              </Stack>

              {/* Step 2 */}
              <Stack gap="xs" className="items-center text-center px-sm">
                <div className="h-14 w-14 bg-brand-indigo/5 text-brand-indigo rounded-pill flex items-center justify-center shadow-sm border border-brand-indigo/10">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-[16px] text-text-primary mt-sm">
                  2. Verified Landlords
                </h3>
                <p className="text-[14px] text-text-muted leading-relaxed mt-xxs">
                  Property owners submit municipal bills to verify ownership. Verified badges prove
                  listing authenticity.
                </p>
              </Stack>

              {/* Step 3 */}
              <Stack gap="xs" className="items-center text-center px-sm">
                <div className="h-14 w-14 bg-brand-indigo/5 text-brand-indigo rounded-pill flex items-center justify-center shadow-sm border border-brand-indigo/10">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-bold text-[16px] text-text-primary mt-sm">
                  3. Community Driven
                </h3>
                <p className="text-[14px] text-text-muted leading-relaxed mt-xxs">
                  Reviews are evaluated across five vectors. Scores update instantly on PostgreSQL
                  database triggers.
                </p>
              </Stack>
            </div>
          </Container>
        </Section>
      </main>

      {/* Shared Footer block */}
      <Footer />
    </div>
  )
}
