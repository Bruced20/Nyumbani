import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'
import { HealthScore, VerifiedOwnerBadge, CommunityListingBadge } from '@ui/badge'
import { PropertyCard, ReviewCard } from '@ui/card'
import { Button } from '@ui/button'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { Gallery } from '@/features/properties/gallery'
import { ActionButtons } from '@/features/properties/action-buttons'
import { HealthBars } from '@/features/properties/health-bars'
import { ReviewCardActions } from '@/features/reviews/review-card-actions'
import { PropertyService } from '@/lib/services/properties'
import { MapPin } from 'lucide-react'

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// 1. Generate Static Params so that Next.js prerenders all 52 detail pages during build time
export async function generateStaticParams() {
  return MOCK_PROPERTIES.map((prop) => ({
    slug: prop.slug,
  }))
}

// 2. Dynamic Metadata generation for SEO optimization
export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = MOCK_PROPERTIES.find((p) => p.slug === slug)

  if (!property) {
    return {
      title: 'Property Not Found | Nyumbani',
      description: 'The requested rental property listing does not exist.',
    }
  }

  return {
    title: `${property.name} | ${property.neighborhood} | Nyumbani`,
    description: `Read verified tenant ratings, safety reviews, and water reliability stats for ${property.name} in ${property.neighborhood}.`,
  }
}

/**
 * Property Details Page.
 * Magazine layout with sticky sidebar. Redesigned against the ten calm-trust
 * design principles: whitespace over containers, one focal point, color with
 * meaning, and progressive disclosure.
 */
export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params

  let property
  try {
    property = await PropertyService.getPropertyBySlug(slug)
  } catch {
    notFound()
  }

  if (!property) {
    notFound()
  }

  const similarProperties = await PropertyService.getNearbyProperties(
    property.neighborhood.split(',')[0],
    slug
  )

  // Shared section-label treatment: consistent everywhere on this page,
  // deliberately quieter than the old uppercase/extrabold eyebrow.
  const sectionLabel = 'text-[14px] font-semibold text-text-muted'

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-6xl flex flex-col gap-lg">
          {/* 1. Hero Gallery — the page's primary visual anchor */}
          <div className="rounded-symmetric overflow-hidden">
            <Gallery images={property.images} />
          </div>

          {/* 2-Column Magazine Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Left Main Pane (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-lg">
              {/* Header Titles block */}
              <div className="flex flex-col gap-xs">
                <div className="flex flex-wrap items-center gap-xs">
                  <h1 className="text-[2.25rem] font-semibold text-text-primary tracking-tight leading-tight">
                    {property.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-sm mt-xxs">
                  {property.isVerified ? <VerifiedOwnerBadge /> : <CommunityListingBadge />}
                  <span
                    className={`px-sm py-[4px] text-[12px] font-semibold rounded-pill border select-none ${
                      property.vacancyStatus
                        ? 'bg-status-success/5 text-status-success border-status-success/20'
                        : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                    }`}
                  >
                    {property.vacancyStatus ? 'Vacancy Available' : 'No Vacancy'}
                  </span>
                  <span className="text-text-muted text-[14px] flex items-center gap-[4px]">
                    <MapPin size={15} className="text-text-muted" />
                    {property.neighborhood}
                  </span>
                </div>
              </div>

              <hr className="border-border-subtle" />

              {/* Quick Facts — borderless label/value pairs, consistent icon treatment.
                  Icon comprehension test: all icons removed. Labels carry the information. */}
              <div className="flex flex-col gap-sm">
                <h2 className={sectionLabel}>Quick Facts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-lg gap-y-sm">
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Water</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.waterSource}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Internet</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.internetType}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Security</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.securityRating} Standard
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Deposit</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.deposit}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Parking</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.parking}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Road</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.roadType} Access
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Garbage</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.garbageReliability}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[12px] text-text-muted">Caretaker</span>
                    <span className="text-[14px] font-semibold text-text-primary truncate">
                      {property.caretakerAvailable ? 'On-site' : 'Off-site'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Community Summary — restyled as editorial synthesis rather
                  than a UI widget. A quiet left rule instead of a dashed box,
                  badge, and sparkle icon. */}
              <div className="flex flex-col gap-sm border-l-2 border-brand-primary/25 pl-md">
                <div className="flex items-center justify-between flex-wrap gap-xs">
                  <h2 className={sectionLabel}>What residents say</h2>
                  <span className="text-[12px] text-text-muted">
                    Summarized from {property.reviews.length} reviews · Overall{' '}
                    {property.aiSummary.sentiment}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xxs">
                    <span className="text-[13px] font-semibold text-text-primary">Positives</span>
                    <ul className="text-[14px] text-text-muted list-disc list-inside leading-relaxed flex flex-col gap-[3px]">
                      {property.aiSummary.positives.map((pos) => (
                        <li key={pos}>{pos}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-xxs">
                    <span className="text-[13px] font-semibold text-text-primary">
                      Common complaints
                    </span>
                    <ul className="text-[14px] text-text-muted list-disc list-inside leading-relaxed flex flex-col gap-[3px]">
                      {property.aiSummary.complaints.map((comp) => (
                        <li key={comp}>{comp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-[14px] text-text-primary leading-relaxed italic">
                  &ldquo;{property.aiSummary.recommendation}&rdquo;
                </p>
              </div>

              {/* Vector breakdowns (Bars) */}
              <div className="flex flex-col gap-sm">
                <h2 className={sectionLabel}>Community quality breakdown</h2>
                <HealthBars
                  ratings={{
                    water: property.waterRating,
                    electricity: property.electricityRating,
                    internet: property.internetType,
                    security: property.securityRating,
                    parking: property.parking,
                    road: property.roadType,
                    garbage: property.garbageReliability,
                  }}
                />
              </div>

              {/* Amenities — plain text list, no per-item box or icon */}
              <div className="flex flex-col gap-sm">
                <h2 className={sectionLabel}>Amenities</h2>
                <div className="flex flex-wrap gap-x-lg gap-y-xs">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="text-[14px] text-text-primary">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location Map and Distance details */}
              <div className="flex flex-col gap-sm">
                <h2 className={sectionLabel}>Location & Nearby Areas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Left Side: Mock Static map — kept bordered since it is a
                      functional bounded canvas, not a decorative card */}
                  <div className="h-[220px] bg-bg-secondary rounded-symmetric border border-border-subtle relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-4 grid-rows-4 border border-slate-300">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="border border-slate-300" />
                      ))}
                    </div>
                    <div className="flex flex-col items-center text-center gap-xxs p-xs z-10">
                      <MapPin size={22} className="text-brand-primary" />
                      <span className="font-semibold text-[15px] text-text-primary mt-xxs">
                        {property.neighborhood}
                      </span>
                      <span className="text-[12px] text-text-muted">
                        Lat: {property.coordinates.lat.toFixed(4)} | Lng:{' '}
                        {property.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Transit Distance details — plain list, no box */}
                  <div className="flex flex-col gap-sm justify-center">
                    <span className="text-[12px] text-text-muted">Transit walking distance</span>
                    <div className="flex flex-col gap-xs">
                      {property.nearbyPlaces.map((place) => (
                        <div
                          key={place.name}
                          className="flex justify-between items-center text-[14px] border-b border-border-subtle/40 pb-xxs"
                        >
                          <span className="font-medium text-text-primary">{place.name}</span>
                          <span className="text-text-muted">{place.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews — a divided list rather than boxed cards, so it reads
                  like testimonials rather than tagged UI components */}
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-center flex-wrap gap-xs">
                  <h2 className={sectionLabel}>Resident Reviews</h2>
                  <Link href={`/review/new?propertyId=${property.id}`}>
                    <Button
                      variant="outline"
                      className="text-metadata px-sm py-[6px] h-auto cursor-pointer"
                    >
                      Write a Review
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col">
                  {property.reviews.map((rev, idx) => {
                    // Pass through only what the reviewer actually submitted —
                    // vectors and recommendation render solely when present.
                    const role = rev.roleTag ?? rev.role ?? 'Community Contributor'

                    return (
                      <div
                        key={rev.id}
                        className={`flex flex-col gap-xs ${idx !== 0 ? 'border-t border-border-subtle' : ''}`}
                      >
                        <ReviewCard
                          roleTag={role}
                          createdAt={rev.createdAt}
                          overallRating={rev.rating}
                          waterRating={rev.waterRating}
                          securityRating={rev.securityRating}
                          caretakerRating={rev.caretakerRating}
                          recommend={rev.recommend}
                          comment={rev.comment}
                          isVerifiedResident={false}
                        />
                        <div className="pb-md">
                          <ReviewCardActions reviewId={rev.id} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Owner Responses — closing note, no icon */}
              <div className="flex flex-col gap-xxs pt-sm border-t border-border-subtle">
                <span className="text-[14px] font-semibold text-text-primary">
                  Owner &amp; Caretaker Response
                </span>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  Verified landlords can review resident reports and post updates here once they
                  claim listing ownership. No claims have been recorded yet.
                </p>
              </div>
            </div>

            {/* Right Sticky Sidebar (4 cols) — the one surface on this page
                that keeps a border + shadow, since it is a genuinely distinct
                control panel rather than page content */}
            <div className="lg:col-span-4 lg:sticky lg:top-[96px] flex flex-col gap-md">
              <div className="bg-bg-secondary border border-border-subtle p-md rounded-symmetric flex flex-col gap-md shadow-sm">
                {/* Rent — the primary decision number; intentionally dominant */}
                <div className="flex flex-col border-b border-border-subtle pb-sm">
                  <span className="text-[12px] font-medium text-text-muted">Monthly Rent</span>
                  <span className="text-[32px] font-semibold text-text-primary tracking-tight mt-xxs leading-tight">
                    {property.rentMin.toLocaleString()} &ndash; {property.rentMax.toLocaleString()}
                  </span>
                  <span className="text-[13px] text-text-muted mt-[2px]">KES per month</span>
                </div>

                <div className="flex flex-col border-b border-border-subtle pb-sm">
                  <span className="text-[12px] font-medium text-text-muted">House Format</span>
                  <span className="text-[15px] font-semibold text-text-primary mt-xxs">
                    {property.houseType}
                  </span>
                </div>

                {/* Health Score — consolidated to badge + single label */}
                <div className="flex items-center gap-sm">
                  <HealthScore
                    score={property.healthScore}
                    className="h-11 w-11 flex items-center justify-center text-[15px] font-semibold shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-text-primary leading-tight">
                      Health Index
                    </p>
                    <p className="text-[12px] text-text-muted">
                      Based on {property.reviews.length} resident reviews
                    </p>
                  </div>
                </div>

                {/* Sidebar CTAs */}
                <div className="flex flex-col gap-xs pt-xs border-t border-border-subtle">
                  <Link href={`/review/new?propertyId=${property.id}`} className="w-full">
                    <Button variant="primary" className="w-full">
                      Write a Review
                    </Button>
                  </Link>
                  <ActionButtons />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border-subtle my-xl" />

          {/* Similar Properties — breathing room above */}
          <div className="flex flex-col gap-sm pb-lg">
            <h2 className={sectionLabel}>Similar Properties Nearby</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {similarProperties.map((prop) => (
                <Link href={`/property/${prop.slug}`} key={prop.id} className="block group">
                  <PropertyCard
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
                      prop.securityRating === 'Excellent'
                        ? 5
                        : prop.securityRating === 'Good'
                          ? 4
                          : 3
                    }
                  />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
