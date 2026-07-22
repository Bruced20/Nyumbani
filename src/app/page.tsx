import React from 'react'
import Link from 'next/link'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container, Section, Grid, Stack } from '@ui/layout'
import { H1, H2, H4, Body, Small, Caption } from '@ui/typography'
import { PropertyCard } from '@ui/card'
import { VerifiedResidentBadge } from '@ui/badge'
import { SearchBar } from '@/features/properties/search-bar'
import { HeroCarousel, type HeroSlide } from '@/features/properties/hero-carousel'
import { PropertyService } from '@/lib/services/properties'
import { MapPin, ShieldCheck, Building2, MessagesSquare } from 'lucide-react'

/**
 * Public Discovery Homepage — product-first, not marketing.
 * Compact hero whose job is to start a search, a trust band of REAL aggregates,
 * then content: neighborhoods, properties, latest reviews. Every above-the-fold
 * element either helps the user search or builds trust in the reviews.
 */
export default async function Home() {
  const [featuredProperties, stats] = await Promise.all([
    PropertyService.getFeaturedProperties(),
    PropertyService.getPlatformStats(),
  ])

  // Real neighborhoods, ranked by how many featured listings sit in each.
  const neighborhoodCounts = new Map<string, number>()
  for (const p of featuredProperties) {
    const hood = p.neighborhood.split(',')[0].trim()
    neighborhoodCounts.set(hood, (neighborhoodCounts.get(hood) || 0) + 1)
  }
  const topNeighborhoods = Array.from(neighborhoodCounts.keys()).slice(0, 6)

  // Real reviews only — flatten from featured properties, newest first.
  const latestReviews = featuredProperties
    .flatMap((p) => p.reviews.map((r) => ({ review: r, propertyName: p.name, slug: p.slug })))
    .filter((x) => x.review.comment)
    .sort((a, b) => new Date(b.review.createdAt).getTime() - new Date(a.review.createdAt).getTime())
    .slice(0, 3)

  // Top-rated homes for the hero carousel: highest health score first, only
  // those with a photo, capped at five. Doubles as an ad-ready showcase.
  const heroSlides: HeroSlide[] = [...featuredProperties]
    .filter((p) => p.images.length > 0)
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      neighborhood: p.neighborhood.split(',')[0].trim(),
      houseType: p.houseType,
      rentMin: p.rentMin,
      rentMax: p.rentMax,
      healthScore: p.healthScore,
      isVerified: p.isVerified,
      image: p.images[0],
    }))

  // Trust metrics — only render values that are real and non-zero.
  const trustMetrics = [
    stats.totalProperties > 0 && {
      icon: <Building2 size={18} />,
      value: stats.totalProperties.toLocaleString(),
      label: stats.totalProperties === 1 ? 'Property listed' : 'Properties listed',
    },
    stats.totalReviews > 0 && {
      icon: <MessagesSquare size={18} />,
      value: stats.totalReviews.toLocaleString(),
      label: stats.totalReviews === 1 ? 'Tenant review' : 'Tenant reviews',
    },
    stats.verifiedProperties > 0 && {
      icon: <ShieldCheck size={18} />,
      value: stats.verifiedProperties.toLocaleString(),
      label: 'Verified buildings',
    },
    stats.neighborhoods > 0 && {
      icon: <MapPin size={18} />,
      value: stats.neighborhoods.toLocaleString(),
      label: 'Neighbourhoods covered',
    },
  ].filter(Boolean) as { icon: React.ReactNode; value: string; label: string }[]

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* 1. Compact hero — its only job is to start a search */}
        <Section className="bg-bg-primary pt-lg pb-md md:pt-xl md:pb-lg border-b border-border-subtle">
          <Container className="flex flex-col gap-md">
            {/* Top-rated showcase — ad-ready hero carousel */}
            {heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />}

            <div className="flex flex-col gap-xs max-w-2xl">
              <H1 className="leading-tight">Find a home you&apos;ll actually enjoy living in.</H1>
              <Body className="text-text-muted text-[16px] leading-relaxed">
                Read honest tenant reviews on water, security, and deposits before you sign a lease.
              </Body>
            </div>

            {/* Search — the primary action */}
            <div className="w-full max-w-2xl shadow-md rounded-symmetric">
              <SearchBar />
            </div>

            {/* Popular areas — real shortcuts into search */}
            {topNeighborhoods.length > 0 && (
              <div className="flex flex-wrap items-center gap-xs">
                <Caption className="text-text-muted">Popular:</Caption>
                {topNeighborhoods.map((area) => (
                  <Link
                    key={area}
                    href={`/search?location=${encodeURIComponent(area)}`}
                    className="px-sm py-xxs border border-border-subtle rounded-pill text-[13px] font-medium text-text-primary hover:border-brand-primary hover:text-brand-primary transition-colors"
                  >
                    {area}
                  </Link>
                ))}
              </div>
            )}

            {/* Trust band — REAL aggregates, computed from data, never fabricated */}
            {trustMetrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md pt-sm mt-xxs border-t border-border-subtle">
                {trustMetrics.map((m) => (
                  <div key={m.label} className="flex items-center gap-sm">
                    <span className="h-10 w-10 shrink-0 rounded-soft bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      {m.icon}
                    </span>
                    <div className="flex flex-col leading-none gap-xxs">
                      <span className="text-[20px] font-semibold text-text-primary tracking-tight">
                        {m.value}
                      </span>
                      <Caption className="text-text-muted">{m.label}</Caption>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>

        {/* 2. Featured neighborhoods */}
        {topNeighborhoods.length > 0 && (
          <Section className="py-lg bg-bg-primary">
            <Container className="flex flex-col gap-md">
              <div className="flex items-end justify-between gap-sm">
                <H2>Explore neighbourhoods</H2>
                <Link
                  href="/search"
                  className="text-[14px] font-semibold text-brand-primary hover:underline underline-offset-4 shrink-0"
                >
                  All areas →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-sm">
                {topNeighborhoods.map((area) => (
                  <Link
                    key={area}
                    href={`/search?location=${encodeURIComponent(area)}`}
                    className="flex items-center gap-xs px-sm py-sm bg-bg-secondary border border-border-subtle rounded-soft hover:border-brand-primary hover:shadow-sm transition-all"
                  >
                    <MapPin size={16} className="text-brand-primary shrink-0" />
                    <span className="text-[14px] font-medium text-text-primary truncate">
                      {area}
                    </span>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* 3. Featured properties */}
        <Section className="py-lg bg-bg-primary">
          <Container className="flex flex-col gap-md">
            <div className="flex items-end justify-between gap-sm">
              <H2>Recently reviewed</H2>
              <Link
                href="/search"
                className="text-[14px] font-semibold text-brand-primary hover:underline underline-offset-4 shrink-0"
              >
                View all →
              </Link>
            </div>
            <Grid cols={3} gap="md">
              {featuredProperties.map((prop) => (
                <Link href={`/property/${prop.slug}`} key={prop.id} className="block group">
                  <PropertyCard
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
                      prop.securityRating === 'Excellent'
                        ? 5
                        : prop.securityRating === 'Good'
                          ? 4
                          : 3
                    }
                  />
                </Link>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* 4. Latest tenant reviews — real submissions only */}
        {latestReviews.length > 0 && (
          <Section className="py-lg bg-bg-secondary border-y border-border-subtle">
            <Container className="flex flex-col gap-md">
              <H2>What residents are saying</H2>
              <Grid cols={3} gap="md">
                {latestReviews.map(({ review, propertyName, slug }) => (
                  <Link
                    key={review.id}
                    href={`/property/${slug}`}
                    className="flex flex-col gap-sm p-md bg-bg-primary border border-border-subtle rounded-symmetric hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-xs">
                      <span className="text-[13px] font-semibold text-text-primary">
                        {review.rating.toFixed(1)}
                        <span className="text-text-muted font-normal"> / 5</span>
                      </span>
                      {review.isModerated && <VerifiedResidentBadge />}
                    </div>
                    <p className="text-[14px] text-text-primary leading-relaxed line-clamp-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <div className="flex flex-col gap-xxs mt-auto">
                      <Small className="font-medium text-text-primary">{review.roleTag}</Small>
                      <Caption className="text-text-muted truncate">{propertyName}</Caption>
                    </div>
                  </Link>
                ))}
              </Grid>
            </Container>
          </Section>
        )}

        {/* 5. How Nyumbani works — context, recessive */}
        <Section className="py-lg bg-bg-primary">
          <Container className="flex flex-col gap-md">
            <div className="flex flex-col gap-xxs max-w-[36rem]">
              <H2>How Nyumbani works</H2>
              <Body className="text-text-muted text-[15px] leading-relaxed">
                Built on transparency, anonymity, and manual verification to guarantee renter trust.
              </Body>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-start">
              <Stack gap="xs" className="items-start">
                <span className="text-[13px] font-semibold text-accent-clay tracking-widest">
                  01
                </span>
                <H4 className="font-semibold font-sans">Search anonymously</H4>
                <Small className="leading-relaxed">
                  Browse metrics and resident reviews without creating an account. No SMS paywalls.
                </Small>
              </Stack>
              <Stack gap="xs" className="items-start">
                <span className="text-[13px] font-semibold text-accent-clay tracking-widest">
                  02
                </span>
                <H4 className="font-semibold font-sans">Verified landlords</H4>
                <Small className="leading-relaxed">
                  Owners submit municipal bills to verify ownership. Badges prove listing
                  authenticity.
                </Small>
              </Stack>
              <Stack gap="xs" className="items-start">
                <span className="text-[13px] font-semibold text-accent-clay tracking-widest">
                  03
                </span>
                <H4 className="font-semibold font-sans">Community driven</H4>
                <Small className="leading-relaxed">
                  Reviews are evaluated across five vectors. Scores update as new feedback arrives.
                </Small>
              </Stack>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
