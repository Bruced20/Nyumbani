import { Database } from '@/types/database.types'

// 1. Domain Interfaces representing the business structures
export interface Profile {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: 'Renter' | 'Owner' | 'Moderator' | 'Admin'
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  propertyId: string
  userId: string
  roleTag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
  role: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
  waterRating: number
  securityRating: number
  caretakerRating: number
  rating: number
  recommend: 'Yes' | 'Maybe' | 'No'
  comment: string | null
  isModerated: boolean
  createdAt: string
  updatedAt: string
}

export interface OwnerClaim {
  id: string
  propertyId: string
  userId: string
  documentUrl: string
  status: 'Pending' | 'Approved' | 'Rejected'
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
}

export interface NearbyPlace {
  name: string
  type: string
  distance: string
}

export interface Property {
  id: string
  slug: string
  name: string
  neighborhood: string
  rentMin: number
  rentMax: number
  houseType:
    'Single Room' | 'Bedsitter' | 'Studio' | 'One Bedroom' | 'Two Bedroom' | 'Three Bedroom'
  waterSource: string
  waterRating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  electricityRating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  internetType: 'Fiber Available' | 'Mobile Internet Only' | 'No Internet'
  securityRating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  parking: 'Available' | 'Limited' | 'None'
  roadType: 'Tarmac' | 'Murram' | 'Seasonal'
  garbageReliability: 'Reliable' | 'Occasional' | 'Poor'
  healthScore: number
  reviewCount: number
  vacancyStatus: boolean
  isVerified: boolean
  updatedAt: string
  coordinates: {
    lat: number
    lng: number
  }
  deposit: string
  distanceFromRoad: string
  availableUnits: number
  petsAllowed: boolean
  caretakerAvailable: boolean
  amenities: string[]
  nearbyPlaces: NearbyPlace[]
  reviews: Review[]
  aiSummary: {
    sentiment: string
    positives: string[]
    complaints: string[]
    recommendation: string
  }
  images: string[]
}

// 2. Mapper helper functions
export const mapProfileRow = (row: Database['public']['Tables']['profiles']['Row']): Profile => {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapReviewRow = (row: Database['public']['Tables']['reviews']['Row']): Review => {
  return {
    id: row.id,
    propertyId: row.property_id,
    userId: row.user_id,
    roleTag: row.role_tag,
    role: row.role_tag,
    waterRating: row.water_rating,
    securityRating: row.security_rating,
    caretakerRating: row.caretaker_rating,
    rating: parseFloat(
      ((row.water_rating + row.security_rating + row.caretaker_rating) / 3).toFixed(1)
    ),
    recommend: row.recommend,
    comment: row.comment,
    isModerated: row.is_moderated,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapClaimRow = (row: Database['public']['Tables']['claims']['Row']): OwnerClaim => {
  return {
    id: row.id,
    propertyId: row.property_id,
    userId: row.user_id,
    documentUrl: row.document_url,
    status: row.status,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Maps database tables properties and associated details into a single Property domain model.
 */
export const mapProperty = (
  propRow: Database['public']['Tables']['properties']['Row'],
  imageRows: Database['public']['Tables']['property_images']['Row'][] = [],
  amenityRows: Database['public']['Tables']['property_amenities']['Row'][] = [],
  nearbyRows: Database['public']['Tables']['nearby_places']['Row'][] = [],
  reviewRows: Database['public']['Tables']['reviews']['Row'][] = []
): Property => {
  // Calculate average rating string equivalents based on reviews
  const avgRatingString = (ratingsList: number[]): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
    if (ratingsList.length === 0) return 'Excellent' // fallback default
    const avg = ratingsList.reduce((a, b) => a + b, 0) / ratingsList.length
    if (avg >= 4.5) return 'Excellent'
    if (avg >= 3.5) return 'Good'
    if (avg >= 2.5) return 'Fair'
    return 'Poor'
  }

  const waterRatings = reviewRows.map((r) => r.water_rating)
  const securityRatings = reviewRows.map((r) => r.security_rating)
  const caretakerRatings = reviewRows.map((r) => r.caretaker_rating)

  const waterRating = avgRatingString(waterRatings)
  const securityRating = avgRatingString(securityRatings)
  const caretakerRatingValue =
    caretakerRatings.length > 0
      ? caretakerRatings.reduce((a, b) => a + b, 0) / caretakerRatings.length
      : 4

  // Mapped standard attributes
  const internetProviders = propRow.internet_providers
  const internetType =
    internetProviders.includes('Safaricom Fibre') || internetProviders.includes('Zuku')
      ? 'Fiber Available'
      : internetProviders.length > 0
        ? 'Mobile Internet Only'
        : 'No Internet'

  // Map parking standard indicators
  const parkingSpaces = propRow.parking_spaces.toLowerCase()
  const parking =
    parkingSpaces.includes('assigned') || parkingSpaces.includes('underground')
      ? 'Available'
      : parkingSpaces.includes('limited') || parkingSpaces.includes('street')
        ? 'Limited'
        : 'None'

  const roadAccess = propRow.road_access.toLowerCase()
  const roadType =
    roadAccess.includes('tarmac') || roadAccess.includes('cabro')
      ? 'Tarmac'
      : roadAccess.includes('murram')
        ? 'Murram'
        : 'Seasonal'

  const garbageReliability =
    propRow.deposit_conditions.toLowerCase().includes('garbage') ||
    propRow.neighborhood.toLowerCase().includes('kilimani')
      ? 'Reliable'
      : 'Occasional'

  // Hardcode coordinates offsets based on properties id (deterministic simulation)
  const latSeed = propRow.slug.length * 0.0001
  const lngSeed = propRow.name.length * 0.0001
  const baseLat = propRow.neighborhood.toLowerCase().includes('kilimani') ? -1.2908 : -1.2682
  const baseLng = propRow.neighborhood.toLowerCase().includes('kilimani') ? 36.7828 : 36.8041

  const reviews = reviewRows.map(mapReviewRow)

  return {
    id: propRow.id,
    slug: propRow.slug,
    name: propRow.name,
    neighborhood: propRow.neighborhood,
    rentMin: propRow.rent_min,
    rentMax: propRow.rent_max,
    houseType: propRow.house_type as Property['houseType'],
    waterSource: propRow.water_source,
    waterRating,
    electricityRating: 'Excellent', // Default mock indicators
    internetType,
    securityRating,
    parking,
    roadType,
    garbageReliability,
    healthScore: parseFloat(propRow.health_score.toString()) || 5.0,
    reviewCount: reviews.length,
    vacancyStatus: true, // Default vacancy availability status
    isVerified: propRow.is_verified,
    updatedAt: propRow.updated_at,
    coordinates: {
      lat: baseLat + (latSeed % 0.01) - 0.005,
      lng: baseLng + (lngSeed % 0.01) - 0.005,
    },
    deposit: propRow.deposit_conditions,
    distanceFromRoad: propRow.public_transport_dist,
    availableUnits: 3, // Default mock stock indicator
    petsAllowed: true,
    caretakerAvailable: caretakerRatingValue >= 3.5,
    amenities:
      amenityRows.length > 0
        ? amenityRows.map((a) => a.amenity_name)
        : ['Water Backup Tank', '24/7 Gate Guard', 'Zuku/Safaricom Fiber'],
    nearbyPlaces:
      nearbyRows.length > 0
        ? nearbyRows.map((n) => ({ name: n.name, type: n.type, distance: n.distance }))
        : [{ name: 'Transit Stage', type: 'Transit', distance: '5 min walk' }],
    reviews,
    aiSummary: {
      sentiment: propRow.health_score >= 4.0 ? 'Highly Positive' : 'Mixed Positive',
      positives: ['Reliable water supply', 'Secure perimeter wall'],
      complaints: ['Noise from main road'],
      recommendation:
        propRow.health_score >= 4.0 ? 'Highly recommended listing.' : 'Recommended with caveats.',
    },
    images:
      imageRows.length > 0
        ? imageRows.map((i) => i.image_url)
        : [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
          ],
  }
}
