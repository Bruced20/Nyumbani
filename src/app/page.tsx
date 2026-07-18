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

export default async function Home() {
  const featuredProperties = await PropertyService.getFeaturedProperties()
  const popularAreas = KENYAN_LOCATIONS.slice(0, 5)
  const heroImage =
    featuredProperties[0]?.images?.[0] ||
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80'

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main className="flex-1">
        <Section className="relative bg-bg-primary py-0 overflow-hidden">
          <div className="absolute inset-0 h-[600px] w-full">
            <img
              src={heroImage}
              alt="Nyumbani communities"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent" />
          </div>
          <Container className="relative z-10 max-w-3xl pt-xl pb-md md:pt-[96px] md:pb-lg flex flex-col items-start gap-md">
            <div className="max-w-2xl">
              <Display className="text-white max-w-2xl md:text-[3.75rem]">
                What is it actually like to live here?
              </Display>
              <Body className="text-white/90 text-[16px] md:text-[18px] leading-relaxed mt-sm max-w-xl">
                Real reviews from real residents — water reliability, security, and deposit refunds,
                before you sign a lease.
              </Body>
            </div>
            <p className="text-white/70 text-[13px] select-none">
              Free for renters · Anonymous by default · Landlords verified by municipal bills
            </p>
          </Container>
          <div className="relative z-20 -mx-md md:mx-auto max-w-2xl px-md md:px-0">
            <div className="shadow-lg rounded-symmetric overflow-hidden">
              <SearchBar />
            </div>
          </div>
          <Container className="relative z-10 max-w-3xl flex flex-wrap items-center justify-start gap-xs mt-md pb-xl md:pb-xl">
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
          </Container>
        </Section>
        <Section className="py-xl bg-bg-primary">
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
        <Section className="bg-bg-secondary border-t border-border-subtle py-xl">
          <Container>
            <div className="flex flex-col gap-xxs mb-xl max-w-xl">
              <H2>How Nyumbani Works</H2>
              <Body className="text-text-muted text-[15px] leading-relaxed">
                Built on transparency, anonymity, and manual verification to guarantee renter trust.
              </Body>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl items-start">
              <Stack gap="xs" className="items-start text-left px-0">
                <span className="text-[13px] font-semibold text-accent-clay tracking-widest">
                  01
                </span>
                <H4 className="font-semibold font-sans mt-xxs">Search Anonymously</H4>
                <Small className="leading-relaxed mt-xxs text-left">
                  Browse apartment metrics and resident evaluations without ever needing to create
                  an account. No SMS paywalls.
                </Small>
              </Stack>
              <Stack gap="xs" className="items-start text-left px-0">
                <span className="text-[13px] font-semibold text-accent-clay tracking-widest">
                  02
                </span>
                <H4 className="font-semibold font-sans mt-xxs">Verified Landlords</H4>
                <Small className="leading-relaxed mt-xxs text-left">
                  Property owners submit municipal bills to verify ownership. Verified badges prove
                  listing authenticity.
                </Small>
              </Stack>
              <Stack gap="xs" className="items-start text-left px-0">
                <span className="text-[13px] font-semibold text-accent-clay tracking-widest">
                  03
                </span>
                <H4 className="font-semibold font-sans mt-xxs">Community Driven</H4>
                <Small className="leading-relaxed mt-xxs text-left">
                  Reviews are evaluated across five vectors. Scores update automatically whenever
                  new tenant feedback is submitted.
                </Small>
              </Stack>
            </div>
          </Container>
        </Section>
        <Section className="py-xl bg-bg-primary">
          <Container className="max-w-2xl flex flex-col items-start gap-xs">
            <H2>Own or manage a building?</H2>
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
