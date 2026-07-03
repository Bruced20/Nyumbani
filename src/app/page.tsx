import React from 'react'
import { Navbar, Footer } from '@ui/navigation'
import { Container, Section, Grid, Stack } from '@ui/layout'
import { Display, H2, Body } from '@ui/typography'
import { PropertyCard } from '@ui/card'
import { SearchBar } from '@/features/properties/search-bar'
import { PropertyService } from '@/lib/services/properties'
import { ShieldCheck, Eye, Sparkles } from 'lucide-react'

/**
 * Public Discovery Homepage.
 * Integrates layout frameworks, featured properties sliders, and explanation checklists.
 * Migrated to load production data directly from Supabase Services.
 */
export default async function Home() {
  // Fetch featured properties directly from Supabase via PropertyService
  const featuredProperties = await PropertyService.getFeaturedProperties()

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar Header */}
      <Navbar />

      {/* Main Homepage content */}
      <main className="flex-1">
        {/* 1. Hero Search Section */}
        <Section className="bg-[#FAFBFD] border-b border-border-subtle py-20">
          <Container className="flex flex-col items-center text-center max-w-3xl gap-sm">
            <Display className="text-display max-w-2xl font-bold leading-tight">
              What is it actually like to live here?
            </Display>
            <Body className="text-text-muted text-[16px] max-w-xl leading-relaxed mb-xs">
              Nyumbani is Kenya’s community-driven rental intelligence network. Discover verified
              details about water reliability, security, and deposit refunds before signing a lease.
            </Body>

            {/* Embedded Search Bar Component */}
            <SearchBar />
          </Container>
        </Section>

        {/* 2. Featured Properties Section */}
        <Section>
          <Container>
            <div className="flex flex-col gap-xxs mb-md">
              <H2 className="font-semibold">Featured Properties</H2>
              <Body className="text-text-muted text-[14px]">
                Explore highly-rated Kenyan listings with active tenant reviews
              </Body>
            </div>

            <Grid cols={3} gap="sm">
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

        {/* 3. "How Nyumbani Works" Section */}
        <Section className="bg-[#FAFBFD] border-y border-border-subtle py-16">
          <Container>
            <div className="flex flex-col gap-xxs mb-lg text-center max-w-xl mx-auto">
              <H2 className="font-semibold">How Nyumbani Works</H2>
              <Body className="text-text-muted text-[14px]">
                Built on transparency, anonymity, and manual verification to guarantee renter trust.
              </Body>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md items-start">
              {/* Step 1 */}
              <Stack gap="xs" className="items-center text-center">
                <div className="h-12 w-12 bg-brand-indigo/10 text-brand-indigo rounded-pill flex items-center justify-center">
                  <Eye size={22} />
                </div>
                <h3 className="font-semibold text-subtitle text-text-primary">
                  1. Search Anonymously
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  Browse apartment metrics and resident evaluations without ever needing to create
                  an account. No SMS paywalls.
                </p>
              </Stack>

              {/* Step 2 */}
              <Stack gap="xs" className="items-center text-center">
                <div className="h-12 w-12 bg-[#10B981]/10 text-[#10B981] rounded-pill flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-semibold text-subtitle text-text-primary">
                  2. Verified Landlords
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  Property owners submit municipal bills to verify ownership. Verified badges prove
                  listing authenticity.
                </p>
              </Stack>

              {/* Step 3 */}
              <Stack gap="xs" className="items-center text-center">
                <div className="h-12 w-12 bg-[#6366F1]/10 text-[#6366F1] rounded-pill flex items-center justify-center">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-semibold text-subtitle text-text-primary">
                  3. Community Driven
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed">
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
