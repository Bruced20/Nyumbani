import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { Footer } from '@ui/navigation'
import { Navbar } from '@/components/navbar-wrapper'
import { Container } from '@ui/layout'
import { HealthScore, VerifiedOwnerBadge, CommunityListingBadge } from '@ui/badge'
import { PropertyCard } from '@ui/card'
import { Button } from '@ui/button'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { Gallery } from '@/features/properties/gallery'
import { ActionButtons } from '@/features/properties/action-buttons'
import { HealthBars } from '@/features/properties/health-bars'
import { ReviewCardActions } from '@/features/reviews/review-card-actions'
import { PropertyService } from '@/lib/services/properties'
import {
  Droplet,
  Wifi,
  Shield,
  Car,
  Road,
  Trash2,
  User,
  Smile,
  Frown,
  MapPin,
  Sparkles,
  Calendar,
  Lock,
  Info,
} from 'lucide-react'

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
 * Redesigned into a premium, visual magazine layout with sticky sidebar (v2 Premium Experience).
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

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-lg">
        <Container className="max-w-6xl flex flex-col gap-lg">
          {/* 1. Hero Gallery Container */}
          <div className="rounded-symmetric overflow-hidden shadow-sm">
            <Gallery images={property.images} />
          </div>

          {/* 2-Column Magazine Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Left Main Pane (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-lg">
              {/* Header Titles block */}
              <div className="flex flex-col gap-xs">
                <div className="flex flex-wrap items-center gap-xs">
                  <h1 className="text-[2.25rem] font-extrabold text-text-primary tracking-tight leading-tight">
                    {property.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-sm mt-xxs">
                  {property.isVerified ? <VerifiedOwnerBadge /> : <CommunityListingBadge />}
                  <span
                    className={`px-sm py-[4px] text-[12px] font-bold rounded-pill border select-none ${
                      property.vacancyStatus
                        ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20'
                        : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                    }`}
                  >
                    {property.vacancyStatus ? 'Vacancy Available' : 'No Vacancy'}
                  </span>
                  <span className="text-text-muted text-[14px] font-medium flex items-center gap-[4px]">
                    <MapPin size={15} className="text-brand-indigo" />
                    {property.neighborhood}
                  </span>
                </div>
              </div>

              <hr className="border-border-subtle" />

              {/* Quick Facts Grid */}
              <div className="flex flex-col gap-sm">
                <h2 className="text-[14px] font-extrabold text-text-muted uppercase tracking-wider">
                  Quick Facts
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Droplet size={13} className="text-brand-indigo" /> Water
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.waterSource}
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Wifi size={13} className="text-brand-indigo" /> Internet
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.internetType}
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Shield size={13} className="text-brand-indigo" /> Security
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.securityRating} Standard
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Info size={13} className="text-brand-indigo" /> Deposit
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.deposit}
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Car size={13} className="text-brand-indigo" /> Parking
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.parking}
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Road size={13} className="text-brand-indigo" /> Road
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.roadType} Access
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <Trash2 size={13} className="text-brand-indigo" /> Garbage
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.garbageReliability}
                    </span>
                  </div>

                  <div className="p-sm bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-xxs shadow-sm">
                    <span className="text-[12px] font-bold text-text-muted flex items-center gap-[4px]">
                      <User size={13} className="text-brand-indigo" /> Caretaker
                    </span>
                    <span className="text-[14px] font-bold text-text-primary truncate">
                      {property.caretakerAvailable ? 'On-site' : 'Off-site'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Community Summary Card */}
              <div className="p-md bg-bg-secondary border border-dashed border-brand-indigo/35 rounded-symmetric relative flex flex-col gap-sm shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-xs">
                  <span className="text-[13px] font-extrabold text-brand-indigo flex items-center gap-[4px] uppercase tracking-wider">
                    <Sparkles size={14} className="text-brand-indigo" />
                    AI Sentiment Summary
                  </span>
                  <span className="text-[12px] bg-brand-indigo/10 text-brand-indigo px-sm py-[4px] rounded-pill font-bold border border-brand-indigo/15">
                    Overall: {property.aiSummary.sentiment}
                  </span>
                </div>

                <p className="text-[15px] text-text-primary leading-relaxed font-bold">
                  Based on crowd-sourced tenant reviews, here is what it is actually like to live
                  here.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-xxs">
                  <div className="flex flex-col gap-xxs">
                    <span className="text-[13px] font-bold text-accent-emerald flex items-center gap-[2px]">
                      <Smile size={14} /> Positives
                    </span>
                    <ul className="text-[14px] text-text-muted list-disc list-inside leading-relaxed flex flex-col gap-[3px]">
                      {property.aiSummary.positives.map((pos) => (
                        <li key={pos}>{pos}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-xxs">
                    <span className="text-[13px] font-bold text-accent-coral flex items-center gap-[2px]">
                      <Frown size={14} /> Common Complaints
                    </span>
                    <ul className="text-[14px] text-text-muted list-disc list-inside leading-relaxed flex flex-col gap-[3px]">
                      {property.aiSummary.complaints.map((comp) => (
                        <li key={comp}>{comp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border-subtle pt-sm mt-xs">
                  <span className="block text-[12px] font-bold text-text-muted uppercase tracking-wider mb-[2px]">
                    Recommendation Summary
                  </span>
                  <p className="text-[14px] text-text-primary leading-relaxed font-bold italic">
                    &ldquo;{property.aiSummary.recommendation}&rdquo;
                  </p>
                </div>
              </div>

              {/* Vector breakdowns (Bars) */}
              <div className="flex flex-col gap-sm">
                <h2 className="text-[14px] font-extrabold text-text-muted uppercase tracking-wider">
                  Community quality breakdown
                </h2>
                <div className="border border-border-subtle p-md rounded-symmetric bg-bg-secondary shadow-sm">
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
              </div>

              {/* Amenities Grid */}
              <div className="flex flex-col gap-sm">
                <h2 className="text-[14px] font-extrabold text-text-muted uppercase tracking-wider">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-xs text-[14px] font-bold text-text-primary bg-bg-secondary border border-border-subtle p-sm rounded-soft shadow-sm"
                    >
                      <Sparkles size={14} className="text-brand-indigo" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Map and Distance details */}
              <div className="flex flex-col gap-sm">
                <h2 className="text-[14px] font-extrabold text-text-muted uppercase tracking-wider">
                  Location & Nearby Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Left Side: Mock Static map */}
                  <div className="h-[220px] bg-bg-secondary rounded-symmetric border border-border-subtle relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
                    <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-4 grid-rows-4 border border-slate-300">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="border border-slate-300" />
                      ))}
                    </div>
                    <div className="flex flex-col items-center text-center gap-xxs p-xs z-10">
                      <MapPin size={22} className="text-brand-indigo" />
                      <span className="font-extrabold text-[15px] text-text-primary mt-xxs">
                        {property.neighborhood}
                      </span>
                      <span className="text-[12px] text-text-muted">
                        Lat: {property.coordinates.lat.toFixed(4)} | Lng:{' '}
                        {property.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Transit Distance details */}
                  <div className="flex flex-col gap-sm p-md bg-bg-secondary border border-border-subtle rounded-symmetric shadow-sm justify-center">
                    <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-xxs">
                      Transit Walking Distance
                    </span>
                    <div className="flex flex-col gap-xs">
                      {property.nearbyPlaces.map((place) => (
                        <div
                          key={place.name}
                          className="flex justify-between items-center text-[14px] border-b border-border-subtle/40 pb-xxs"
                        >
                          <span className="font-bold text-text-primary">{place.name}</span>
                          <span className="text-text-muted font-medium">{place.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-center flex-wrap gap-xs">
                  <h2 className="text-[14px] font-extrabold text-text-muted uppercase tracking-wider">
                    Resident Reviews
                  </h2>
                  <Link href={`/review/new?propertyId=${property.id}`}>
                    <Button
                      variant="outline"
                      className="text-metadata px-sm py-[6px] h-auto cursor-pointer"
                    >
                      Write a Review
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col gap-md">
                  {property.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-bg-secondary border border-border-subtle p-md rounded-symmetric shadow-sm flex flex-col gap-xs"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-xs">
                          <span className="px-sm py-[4px] bg-brand-indigo/10 text-brand-indigo text-[12px] font-bold rounded-pill border border-brand-indigo/20">
                            {rev.role}
                          </span>
                          <span className="text-[12px] text-text-muted flex items-center gap-[4px]">
                            <Calendar size={12} className="text-text-muted/80" />
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-[14px] font-bold text-text-primary">
                          ⭐ {rev.rating.toFixed(1)}
                        </div>
                      </div>

                      <p className="text-[15px] text-text-primary leading-relaxed mt-xxs">
                        {rev.comment}
                      </p>

                      <ReviewCardActions reviewId={rev.id} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Responses */}
              <div className="p-md bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col gap-xxs shadow-sm">
                <div className="flex items-center gap-[6px] text-[14px] font-bold text-text-primary">
                  <Lock size={14} className="text-text-muted" />
                  Owner & Caretaker Response
                </div>
                <p className="text-[13px] text-text-muted leading-relaxed mt-xxs">
                  Verified landlords can review resident reports and post updates here once they
                  claim listing ownership. No claims have been recorded yet.
                </p>
              </div>
            </div>

            {/* Right Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-[96px] flex flex-col gap-md">
              {/* Rent & Format Details card */}
              <div className="bg-bg-secondary border border-border-subtle p-md rounded-symmetric flex flex-col gap-md shadow-sm">
                <div className="flex flex-col border-b border-border-subtle pb-sm">
                  <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">
                    KES Monthly Rent
                  </span>
                  <span className="text-[20px] font-extrabold text-text-primary tracking-tight mt-xxs">
                    {property.rentMin.toLocaleString()} – {property.rentMax.toLocaleString()} KES
                  </span>
                </div>

                <div className="flex flex-col border-b border-border-subtle pb-sm">
                  <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">
                    House Format
                  </span>
                  <span className="text-[15px] font-extrabold text-text-primary mt-xxs">
                    {property.houseType}
                  </span>
                </div>

                {/* Overall Health score visualizer inside Sidebar */}
                <div className="flex items-center gap-xs pt-xxs">
                  <HealthScore
                    score={property.healthScore}
                    className="h-11 w-11 flex items-center justify-center text-[15px] font-extrabold"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[14px] text-text-primary leading-tight">
                      Health Index
                    </h3>
                    <p className="text-[11px] text-text-muted">
                      Based on {property.reviews.length} tenant vectors
                    </p>
                  </div>
                  <div className="text-[18px] font-black text-brand-indigo pr-xxs">
                    {Math.round(property.healthScore * 20)}
                    <span className="text-[11px] text-text-muted font-normal">/100</span>
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

          <hr className="border-border-subtle my-sm" />

          {/* Similar Properties Suggested List */}
          <div className="flex flex-col gap-sm py-sm">
            <h2 className="text-[14px] font-extrabold text-text-muted uppercase tracking-wider">
              Similar Properties Nearby
            </h2>
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
                    caretakerRating={prop.healthScore >= 4 ? 4.5 : 3.5}
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
