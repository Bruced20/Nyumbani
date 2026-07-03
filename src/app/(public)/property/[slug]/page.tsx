import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { Navbar, Footer } from '@ui/navigation'
import { Container, Divider } from '@ui/layout'
import { HealthScore, VerifiedOwnerBadge, CommunityListingBadge } from '@ui/badge'
import { PropertyCard } from '@ui/card'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { Gallery } from '@/features/properties/gallery'
import { ActionButtons } from '@/features/properties/action-buttons'
import { HealthBars } from '@/features/properties/health-bars'
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
  ThumbsUp,
  AlertTriangle,
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
 * Strictly adheres to the hierarchy of Decision 1:
 * 1. Hero Gallery
 * 2. Property Name
 * 3. Verified Owner or Community Listing Badge
 * 4. Rent and House Type
 * 5. Property Health Score
 * 6. Quick Facts (Water, Internet, Security, Deposit, Parking, Road Access, Public Transport)
 * 7. AI Community Summary
 * 8. Community Ratings (Category bars)
 * 9. Resident Reviews
 * 10. Owner Responses
 */
export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params
  const property = MOCK_PROPERTIES.find((p) => p.slug === slug)

  if (!property) {
    notFound()
  }

  // Find 3 similar properties in the same neighborhood or same price range
  const similarProperties = MOCK_PROPERTIES.filter(
    (p) =>
      p.id !== property.id && p.neighborhood.split(',')[0] === property.neighborhood.split(',')[0]
  ).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-md">
        <Container className="max-w-4xl flex flex-col gap-md">
          {/* 1. Hero Gallery Carousel Overlay */}
          <Gallery images={property.images} />

          {/* 2 & 3. Property Name and Verified Owner/Community Badge */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-xs mt-xxs">
            <div className="flex flex-col gap-xxs">
              <div className="flex flex-wrap items-center gap-xs">
                <h1 className="text-display font-semibold text-text-primary leading-tight">
                  {property.name}
                </h1>

                {property.isVerified ? <VerifiedOwnerBadge /> : <CommunityListingBadge />}

                <span
                  className={`px-xs py-[2px] text-[11px] font-bold rounded-pill border select-none ${
                    property.vacancyStatus
                      ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20'
                      : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                  }`}
                >
                  {property.vacancyStatus ? 'Vacancy Available' : 'No Vacancy'}
                </span>
              </div>

              <span className="text-text-muted text-[13px] font-medium flex items-center gap-[4px] mt-[2px]">
                <MapPin size={14} className="text-brand-indigo" />
                {property.neighborhood}
              </span>
            </div>

            {/* Share / Save buttons */}
            <ActionButtons />
          </div>

          <Divider />

          {/* 4. Rent and House Type Info Card */}
          <div className="bg-bg-secondary border border-border-subtle p-sm rounded-symmetric flex flex-col sm:flex-row justify-between items-start sm:items-center gap-xs">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">
                KES Monthly Rent
              </span>
              <span className="text-subtitle font-bold text-text-primary">
                {property.rentMin.toLocaleString()} – {property.rentMax.toLocaleString()} KES
              </span>
            </div>
            <div className="flex flex-col sm:text-right">
              <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">
                House Format
              </span>
              <span className="text-[15px] font-semibold text-text-primary">
                {property.houseType}
              </span>
            </div>
          </div>

          {/* 5. Overall Property Health Score Banner */}
          <div className="flex items-center gap-sm bg-bg-secondary p-sm rounded-symmetric border border-border-subtle shadow-sm">
            <HealthScore
              score={property.healthScore}
              className="h-12 w-12 flex items-center justify-center text-subtitle font-bold"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-text-primary">
                {property.healthScore >= 4.5
                  ? 'Excellent Health Score'
                  : property.healthScore >= 3.5
                    ? 'Good Health Score'
                    : 'Fair Health Score'}
              </h3>
              <p className="text-[12px] text-text-muted">
                Calculated from {property.reviews.length} active tenant evaluation vectors.
              </p>
            </div>
            <div className="text-[22px] font-black text-brand-indigo shrink-0">
              {Math.round(property.healthScore * 20)}
              <span className="text-[12px] text-text-muted font-normal">/100</span>
            </div>
          </div>

          {/* 6. Quick Facts Grid (Decision 1: placed before AI Community summary) */}
          <div className="flex flex-col gap-xs">
            <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">
              Quick Facts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-xs">
              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Droplet size={12} /> Water
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.waterSource}
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Wifi size={12} /> Internet
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.internetType}
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Shield size={12} /> Security
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.securityRating} Standard
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Info size={12} /> Deposit
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.deposit}
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Car size={12} /> Parking
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.parking}
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Road size={12} /> Road Access
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.roadType} access
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <Trash2 size={12} /> Garbage
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.garbageReliability} Collection
                </span>
              </div>

              <div className="p-xs bg-bg-secondary rounded-soft border border-border-subtle flex flex-col gap-[2px]">
                <span className="text-[11px] font-bold text-text-muted flex items-center gap-[2px]">
                  <User size={12} /> Caretaker
                </span>
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {property.caretakerAvailable ? 'On-site' : 'Off-site'}
                </span>
              </div>
            </div>
          </div>

          {/* 7. AI Community Summary Sentiment Card */}
          <div className="p-sm bg-bg-secondary border border-dashed border-brand-indigo/30 rounded-symmetric relative flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-brand-indigo flex items-center gap-[4px] uppercase tracking-wider">
                <Sparkles size={14} className="text-brand-indigo" />
                AI Sentiment Summary
              </span>
              <span className="text-[11px] bg-brand-indigo/5 text-brand-indigo px-xs py-[2px] rounded-pill font-bold">
                Overall: {property.aiSummary.sentiment}
              </span>
            </div>

            <p className="text-[14px] text-text-primary leading-relaxed font-medium">
              Based on crowd-sourced verified evaluations, we summarized what it is actually like to
              live here.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-xxs">
              <div className="flex flex-col gap-xxs">
                <span className="text-[12px] font-bold text-accent-emerald flex items-center gap-[2px]">
                  <Smile size={13} /> Positives
                </span>
                <ul className="text-[13px] text-text-muted list-disc list-inside leading-relaxed flex flex-col gap-[2px]">
                  {property.aiSummary.positives.map((pos) => (
                    <li key={pos}>{pos}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-[12px] font-bold text-accent-coral flex items-center gap-[2px]">
                  <Frown size={13} /> Common Complaints
                </span>
                <ul className="text-[13px] text-text-muted list-disc list-inside leading-relaxed flex flex-col gap-[2px]">
                  {property.aiSummary.complaints.map((comp) => (
                    <li key={comp}>{comp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-xs mt-xxs">
              <span className="block text-[12px] font-bold text-text-muted uppercase tracking-wider mb-[2px]">
                Nyumbani Recommendation
              </span>
              <p className="text-[13px] text-text-primary leading-relaxed font-semibold italic">
                &ldquo;{property.aiSummary.recommendation}&rdquo;
              </p>
            </div>
          </div>

          {/* 8. Community Ratings Individual Progress Bars */}
          <div className="flex flex-col gap-xs">
            <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">
              Vector breakdown
            </h2>
            <div className="border border-border-subtle p-sm rounded-symmetric bg-bg-secondary shadow-sm">
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
          <div className="flex flex-col gap-xs">
            <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-xs">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-xs text-[13px] font-semibold text-text-primary bg-bg-secondary border border-border-subtle p-xs rounded-soft"
                >
                  <Sparkles size={14} className="text-brand-indigo" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Location & Transit Map */}
          <div className="flex flex-col gap-xs">
            <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">
              Location & Nearby Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
              {/* Left Side: Mock Static map */}
              <div className="h-[200px] bg-slate-100 rounded-symmetric border border-border-subtle relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
                <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-4 grid-rows-4 border border-slate-300">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-slate-300" />
                  ))}
                </div>
                <div className="flex flex-col items-center text-center gap-xxs p-xs z-10">
                  <MapPin size={20} className="text-brand-indigo" />
                  <span className="font-semibold text-[13px] text-text-primary">
                    {property.neighborhood}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Lat: {property.coordinates.lat.toFixed(4)} | Lng:{' '}
                    {property.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Right Side: Transit Distance details */}
              <div className="flex flex-col gap-xs p-sm bg-bg-secondary border border-border-subtle rounded-symmetric shadow-sm">
                <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">
                  Transit Walking Distance
                </span>
                <div className="flex flex-col gap-xxs">
                  {property.nearbyPlaces.map((place) => (
                    <div key={place.name} className="flex justify-between items-center text-[13px]">
                      <span className="font-semibold text-text-primary">{place.name}</span>
                      <span className="text-text-muted">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 9. Resident ReviewsTimeline */}
          <div className="flex flex-col gap-sm">
            <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">
              Resident Reviews
            </h2>
            <div className="flex flex-col gap-xs">
              {property.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-bg-secondary border border-border-subtle p-sm rounded-symmetric shadow-sm flex flex-col gap-xs"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-xs">
                      <span className="px-xs py-[2px] bg-brand-indigo/10 text-brand-indigo text-[11px] font-bold rounded-pill border border-brand-indigo/15">
                        {rev.role}
                      </span>
                      <span className="text-[11px] text-text-muted flex items-center gap-[2px]">
                        <Calendar size={11} />
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[13px] font-bold text-text-primary">
                      ⭐ {rev.rating.toFixed(1)}
                    </div>
                  </div>

                  <p className="text-[14px] text-text-primary leading-relaxed">{rev.comment}</p>

                  <div className="flex gap-xs border-t border-border-subtle pt-xs mt-xxs">
                    <button
                      disabled
                      className="text-[12px] text-text-muted hover:text-text-primary disabled:opacity-40 flex items-center gap-[4px] cursor-not-allowed"
                    >
                      <ThumbsUp size={12} />
                      Helpful
                    </button>
                    <button
                      disabled
                      className="text-[12px] text-text-muted hover:text-accent-coral disabled:opacity-40 flex items-center gap-[4px] cursor-not-allowed"
                    >
                      <AlertTriangle size={12} />
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Owner & Management Responses */}
          <div className="p-sm bg-bg-secondary border border-border-subtle rounded-symmetric flex flex-col gap-xxs shadow-sm">
            <div className="flex items-center gap-[4px] text-[13px] font-bold text-text-primary">
              <Lock size={13} className="text-text-muted" />
              Owner & Caretaker Response
            </div>
            <p className="text-[13px] text-text-muted leading-relaxed">
              Verified landlords can review resident reports and post updates here once they claim
              listing ownership. No claims have been recorded yet.
            </p>
          </div>

          <Divider />

          {/* Similar Properties suggested list */}
          <div className="flex flex-col gap-xs">
            <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">
              Similar Properties Nearby
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
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
