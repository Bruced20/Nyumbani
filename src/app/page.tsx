import React from 'react'
import Link from 'next/link'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container, Section, Grid, Stack } from '@ui/layout'
import { Display, H2, H4, Body, Small } from '@ui/typography'
import { PropertyCard } from '@ui/card'
import { SearchBar } from '@/features/properties/search-bar'
import { PropertyService } from '@/lib/services/properties'
import { KENYAN_LOCATIONS } from '@/lib/mock-data'

/**
 * Public Discovery Homepage.
 * Sprint P1: search is the hero and the page's only primary CTA.
 * Marketplace structure: search hero → popular areas → featured listings →
 * how it works (recedes) → owner path. Trust is stated in words, not numbers —
 * no fabricated stats.
 */
export default async function Home() {
  const featuredProperties = await PropertyService.getFeaturedProperties()
  const popularAreas = KENYAN_LOCATIONS.slice(0, 5)

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero — search is the anchor; everything else supports it */}
        <Section className="bg-transparent pt-xl md:pt-[88px] pb-lg md:pb-xl flex items-center justify-center">
          <Container className="flex flex-col items-center text-center max-w-3xl gap-sm">
            <Display className="max-w-3xl md:text-[3.75rem]">
              What is it actually like to live here?
            </Display>
            <Body className="text-text-muted text-[18px] max-w-2xl leading-relaxed mt-xxs mb-md">
              Real reviews from real residents — water reliability, security, and deposit refunds,
              before you sign a lease.
            </Body>

            {/* Search Bar — the page's primary interactive anchor */}
            <div className="w-full max-w-2xl shadow-lg rounded-symmetric">
              <SearchBar />
            </div>

            {/* Popular areas — real shortcuts into search, not decoration */}
            <div className="flex flex-wrap items-center justify-center gap-xs mt-sm">
              <span className="text-[13px] text-text-muted select-none">Popular:</span>
              {popularAreas.map((area) => (
                <Link
                  key={area}
                  href={`/search?location=${encodeURIComponent(area)}`}
                  className="px-sm py-xxs border border-border-subtle rounded-pill text-[13px] font-medium text-text-primary hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  {area}
                </Link>
              ))}
            </div>

            {/* Trust line — words, not invented numbers */}
            <p className="text-[13px] text-text-muted mt-lg select-none">
              Free for renters · Anonymous by default · Landlords verified by municipal bills
            </p>
          </Container>
        </Section>

        {/* 2. Featured Properties */}
        <Section className="py-xl bg-transparent">
          <Container>
            <div className="flex items-end justify-between flex-wrap gap-sm mb-lg">
              <div className="flex flex-col gap-xxs">
                <H2>Featured Properties</H2>
                <Body className="text-text-muted text-[15px]">
                  Highly-rated Kenyan listings with active tenant reviews
                </Body>
              </div>
              <Link
                href="/search"
                className="text-[14px] font-semibold text-brand-primary hover:underline underline-offset-4 pb-xxs"
              >
                View all properties →
              </Link>
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
                />
              ))}
            </Grid>
          </Container>
        </Section>

        {/* 3. How It Works — recedes visually; context not action */}
        <Section className="bg-bg-secondary border-t border-border-subtle py-xl">
          <Container>
            <div className="flex flex-col gap-xxs mb-xl text-center max-w-xl mx-auto">
              <H2 className="text-[24px]">How Nyumbani Works</H2>
              <Body className="text-text-muted text-[15px] leading-relaxed">
                Built on transparency, anonymity, and manual verification to guarantee renter trust.
              </Body>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl items-start">
              {/* Step 1 */}
              <Stack gap="xs" className="items-center text-center px-sm">
                <span className="text-[13px] font-semibold text-text-muted tracking-widest">
                  01
                </span>
                <H4 className="font-semibold mt-xxs">Search Anonymously</H4>
                <Small className="leading-relaxed mt-xxs text-center">
                  Browse apartment metrics and resident evaluations without ever needing to create
                  an account. No SMS paywalls.
                </Small>
              </Stack>

              {/* Step 2 */}
              <Stack gap="xs" className="items-center text-center px-sm">
                <span className="text-[13px] font-semibold text-text-muted tracking-widest">
                  02
                </span>
                <H4 className="font-semibold mt-xxs">Verified Landlords</H4>
                <Small className="leading-relaxed mt-xxs text-center">
                  Property owners submit municipal bills to verify ownership. Verified badges prove
                  listing authenticity.
                </Small>
              </Stack>

              {/* Step 3 */}
              <Stack gap="xs" className="items-center text-center px-sm">
                <span className="text-[13px] font-semibold text-text-muted tracking-widest">
                  03
                </span>
                <H4 className="font-semibold mt-xxs">Community Driven</H4>
                <Small className="leading-relaxed mt-xxs text-center">
                  Reviews are evaluated across five vectors. Scores update automatically whenever
                  new tenant feedback is submitted.
                </Small>
              </Stack>
            </div>
          </Container>
        </Section>

        {/* 4. Owner path — quiet closing CTA, text link not a billboard */}
        <Section className="py-xl">
          <Container className="max-w-2xl text-center flex flex-col items-center gap-xs">
            <H2 className="text-[24px]">Own or manage a building?</H2>
            <Body className="text-text-muted text-[15px] leading-relaxed">
              Claim your listing to respond to resident reviews, update vacancy status, and earn a
              verified badge.
            </Body>
            <Link
              href="/owners"
              className="text-[14px] font-semibold text-brand-primary hover:underline underline-offset-4 mt-xs"
            >
              Visit the Owner Hub →
            </Link>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
