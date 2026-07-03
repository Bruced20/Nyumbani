export interface ReviewMock {
  id: string
  role: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
  rating: number
  comment: string
  createdAt: string
}

export interface NearbyPlaceMock {
  name: string
  type: string
  distance: string // e.g. "5 min walk", "10 min walk"
}

export interface PropertyMock {
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
  // Added detailed mock fields for Sprint 3C
  deposit: string
  distanceFromRoad: string
  availableUnits: number
  petsAllowed: boolean
  caretakerAvailable: boolean
  amenities: string[]
  nearbyPlaces: NearbyPlaceMock[]
  reviews: ReviewMock[]
  aiSummary: {
    sentiment: string
    positives: string[]
    complaints: string[]
    recommendation: string
  }
  images: string[]
}

// 30 Realistic Kenyan locations for Autocomplete
export const KENYAN_LOCATIONS = [
  'Westlands',
  'Kilimani',
  'Kileleshwa',
  'Lavington',
  'South B',
  'South C',
  "Lang'ata",
  'Karen',
  'Embakasi',
  'Pipeline',
  'Roysambu',
  'Kasarani',
  'Zimmerman',
  'Ruaka',
  'Ruiru',
  'Kikuyu',
  'Syokimau',
  'Mlolongo',
  'Utawala',
  'Thika Road',
  'Parklands',
  'Gigiri',
  'Hurlingham',
  'Madaraka',
  'Donholm',
  'Imara Daima',
  'Kahawa Sukari',
  'Kahawa Wendani',
  'Ngong',
  'Rongai',
]

// Nearby neighborhood mapping for search recommendations when empty
export const NEARBY_NEIGHBORHOODS: Record<string, string[]> = {
  westlands: ['Parklands', 'Gigiri', 'Kileleshwa', 'Lavington', 'Hurlingham'],
  kilimani: ['Kileleshwa', 'Lavington', 'Hurlingham', 'Madaraka', 'South C'],
  kileleshwa: ['Lavington', 'Westlands', 'Kilimani', 'Parklands', 'Hurlingham'],
  lavington: ['Kileleshwa', 'Westlands', 'Karen', 'Kilimani', 'Ngong'],
  'south b': ['South C', 'Madaraka', 'Imara Daima', 'Donholm', 'Pipeline'],
  'south c': ['South B', "Lang'ata", 'Madaraka', 'Hurlingham', 'Imara Daima'],
  "lang'ata": ['South C', 'Karen', 'Ngong', 'Rongai', 'Madaraka'],
  karen: ["Lang'ata", 'Ngong', 'Kikuyu', 'Lavington', 'Rongai'],
  embakasi: ['Pipeline', 'Donholm', 'Utawala', 'Imara Daima', 'South B'],
  pipeline: ['Embakasi', 'Donholm', 'Imara Daima', 'Utawala', 'South B'],
  roysambu: ['Zimmerman', 'Kasarani', 'Kahawa Sukari', 'Kahawa Wendani', 'Thika Road'],
  kasarani: ['Roysambu', 'Zimmerman', 'Thika Road', 'Kahawa Wendani', 'Utawala'],
  zimmerman: ['Roysambu', 'Kasarani', 'Thika Road', 'Kahawa Sukari', 'Kahawa Wendani'],
  ruaka: ['Westlands', 'Kikuyu', 'Parklands', 'Gigiri', 'Ruiru'],
  ruiru: ['Thika Road', 'Kahawa Sukari', 'Roysambu', 'Kikuyu', 'Zimmerman'],
  kikuyu: ['Karen', 'Ngong', 'Ruaka', 'Westlands', 'Ruiru'],
  syokimau: ['Mlolongo', 'Imara Daima', 'Utawala', 'South B', 'Pipeline'],
  mlolongo: ['Syokimau', 'Utawala', 'Imara Daima', 'Donholm', 'Ngong'],
  utawala: ['Syokimau', 'Mlolongo', 'Pipeline', 'Embakasi', 'Donholm'],
  'thika road': ['Roysambu', 'Kasarani', 'Zimmerman', 'Kahawa Sukari', 'Kahawa Wendani'],
}

// Generator to produce 52 realistic properties across the neighborhoods
const generateMockProperties = (): PropertyMock[] => {
  const neighborhoods = [
    { name: 'Westlands', lat: -1.2682, lng: 36.8041 },
    { name: 'Kilimani', lat: -1.2908, lng: 36.7828 },
    { name: 'Kileleshwa', lat: -1.2789, lng: 36.7766 },
    { name: 'Lavington', lat: -1.2858, lng: 36.7645 },
    { name: 'South B', lat: -1.3105, lng: 36.8373 },
    { name: 'South C', lat: -1.3214, lng: 36.8285 },
    { name: "Lang'ata", lat: -1.3255, lng: 36.7823 },
    { name: 'Karen', lat: -1.3201, lng: 36.7029 },
    { name: 'Embakasi', lat: -1.3197, lng: 36.9028 },
    { name: 'Pipeline', lat: -1.3175, lng: 36.892 },
    { name: 'Roysambu', lat: -1.2189, lng: 36.8885 },
    { name: 'Kasarani', lat: -1.2201, lng: 36.8992 },
    { name: 'Zimmerman', lat: -1.2114, lng: 36.8912 },
    { name: 'Ruaka', lat: -1.2065, lng: 36.7788 },
    { name: 'Ruiru', lat: -1.1492, lng: 36.9582 },
    { name: 'Kikuyu', lat: -1.2541, lng: 36.6817 },
    { name: 'Syokimau', lat: -1.3524, lng: 36.9381 },
    { name: 'Mlolongo', lat: -1.3934, lng: 36.9248 },
    { name: 'Utawala', lat: -1.2801, lng: 36.9744 },
    { name: 'Thika Road', lat: -1.2255, lng: 36.879 },
  ]

  const prefixes = [
    'Sunrise',
    'Pinecrest',
    'Emerald',
    'Oakridge',
    'Bella Vista',
    'Highland',
    'Lantana',
    'Jasmine',
    'Crestview',
    'Royal',
    'Nandi',
    'Tana',
    'Safari',
    'Karibu',
    'Raha',
  ]
  const suffixes = [
    'Apartments',
    'Suites',
    'Court',
    'Gardens',
    'Villas',
    'Plaza',
    'Residency',
    'Homes',
    'Heights',
    'Terraces',
  ]
  const houseTypes: PropertyMock['houseType'][] = [
    'Single Room',
    'Bedsitter',
    'Studio',
    'One Bedroom',
    'Two Bedroom',
    'Three Bedroom',
  ]
  const ratings: ('Excellent' | 'Good' | 'Fair' | 'Poor')[] = ['Excellent', 'Good', 'Fair', 'Poor']
  const internets: PropertyMock['internetType'][] = [
    'Fiber Available',
    'Mobile Internet Only',
    'No Internet',
  ]
  const parkings: PropertyMock['parking'][] = ['Available', 'Limited', 'None']
  const roads: PropertyMock['roadType'][] = ['Tarmac', 'Murram', 'Seasonal']
  const garbages: PropertyMock['garbageReliability'][] = ['Reliable', 'Occasional', 'Poor']

  const properties: PropertyMock[] = []

  // Create exactly 52 properties (to satisfy the "at least 50" requirement)
  for (let i = 0; i < 52; i++) {
    const neighborhoodObj = neighborhoods[i % neighborhoods.length]
    const pfx = prefixes[i % prefixes.length]
    const sfx = suffixes[i % suffixes.length]
    const name = `${pfx} ${sfx}`
    const houseType = houseTypes[i % houseTypes.length]

    // Set realistic rent ranges per house type
    let rentMin = 5000
    let rentMax = 8000
    if (houseType === 'Bedsitter') {
      rentMin = 8000
      rentMax = 12000
    } else if (houseType === 'Studio') {
      rentMin = 12000
      rentMax = 18000
    } else if (houseType === 'One Bedroom') {
      rentMin = 15000
      rentMax = 25000
    } else if (houseType === 'Two Bedroom') {
      rentMin = 22000
      rentMax = 40000
    } else if (houseType === 'Three Bedroom') {
      rentMin = 35000
      rentMax = 80000
    }

    // Add neighborhood modifier (e.g. Karen & Westlands are more expensive)
    if (
      neighborhoodObj.name === 'Karen' ||
      neighborhoodObj.name === 'Westlands' ||
      neighborhoodObj.name === 'Lavington'
    ) {
      rentMin = Math.round(rentMin * 1.5)
      rentMax = Math.round(rentMax * 1.6)
    }

    const water = ratings[i % ratings.length]
    const security = ratings[(i + 1) % ratings.length]
    const caretaker = ratings[(i + 2) % ratings.length]
    const electricity = ratings[(i + 3) % ratings.length]

    const scoreMap = { Excellent: 5, Good: 4, Fair: 3, Poor: 1.5 }
    const healthScore = parseFloat(
      ((scoreMap[water] + scoreMap[security] + scoreMap[caretaker]) / 3).toFixed(2)
    )

    // Build unique slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${neighborhoodObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`

    // Distribute recently updated timeline
    const date = new Date()
    date.setDate(date.getDate() - i * 3)

    // Mock images
    const images = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
    ]

    // Create 3 realistic review objects
    const roles: ReviewMock['role'][] = [
      'Current Resident',
      'Former Resident',
      'Neighbour',
      'Community Contributor',
    ]
    const reviews: ReviewMock[] = [
      {
        id: `rev-${i}-1`,
        role: roles[i % roles.length],
        rating: healthScore >= 4 ? 5 : healthScore >= 3 ? 4 : 3,
        comment: `Excellent location in ${neighborhoodObj.name}. The water is consistently reliable. Caretaker is friendly but can be slow to fix broken tiles.`,
        createdAt: '2026-06-15T12:00:00Z',
      },
      {
        id: `rev-${i}-2`,
        role: roles[(i + 1) % roles.length],
        rating: healthScore >= 4 ? 4 : 3,
        comment: `Safe and secure building. CCTV cameras are active. However, noise levels can get loud on weekends due to passing traffic on the nearby access road.`,
        createdAt: '2026-05-20T10:00:00Z',
      },
      {
        id: `rev-${i}-3`,
        role: roles[(i + 2) % roles.length],
        rating: healthScore >= 4.5 ? 5 : 3,
        comment: `Good value for rent money. Deposit refund takes about 2 weeks after moving out, which is better than most landlords in Nairobi.`,
        createdAt: '2026-04-10T14:30:00Z',
      },
    ]

    properties.push({
      id: `prop-gen-${i}`,
      slug,
      name,
      neighborhood: `${neighborhoodObj.name}, Nairobi`,
      rentMin,
      rentMax,
      houseType,
      waterSource:
        water === 'Excellent' ? 'Borehole & Council (Backup Tanks)' : 'Council Water supply',
      waterRating: water,
      electricityRating: electricity,
      internetType: internets[i % internets.length],
      securityRating: security,
      parking: parkings[i % parkings.length],
      roadType: roads[i % roads.length],
      garbageReliability: garbages[i % garbages.length],
      healthScore,
      reviewCount: reviews.length,
      vacancyStatus: i % 4 !== 0,
      isVerified: i % 3 === 0,
      updatedAt: date.toISOString(),
      coordinates: {
        lat: neighborhoodObj.lat + (Math.random() - 0.5) * 0.015,
        lng: neighborhoodObj.lng + (Math.random() - 0.5) * 0.015,
      },
      // Added detailed mock fields
      deposit: `${Math.round(rentMin * 1.0).toLocaleString()} KES (1 Month)`,
      distanceFromRoad: `${((i * 50) % 250) + 50}m from Main Road`,
      availableUnits: ((i * 3) % 8) + 1,
      petsAllowed: i % 2 === 0,
      caretakerAvailable: i % 3 !== 1,
      amenities: [
        'Water Tank Backup',
        'Secure Perimeter Wall',
        'Zuku/Safaricom Fiber',
        'Assigned Parking Slot',
        'Token Electricity Meters',
        '24/7 Gate Guard',
      ],
      nearbyPlaces: [
        { name: `${neighborhoodObj.name} Shopping Stage`, type: 'Transit', distance: '5 min walk' },
        { name: 'Quickmart Supermarket', type: 'Shopping', distance: '8 min walk' },
        { name: 'Local Community Hospital', type: 'Medical', distance: '12 min walk' },
      ],
      reviews,
      aiSummary: {
        sentiment:
          healthScore >= 4.0
            ? 'Highly Positive'
            : healthScore >= 3.0
              ? 'Mixed Positive'
              : 'Needs attention',
        positives: [
          'High water availability with backup borehole',
          'Stable fiber internet options',
          'Prompt trash removal schedules',
        ],
        complaints: ['Noise from nearby main streets', 'Visitor parking is extremely limited'],
        recommendation:
          healthScore >= 4.0
            ? 'Highly recommended for families looking for secure, hassle-free rental access.'
            : 'A solid option for budget hunters, provided you negotiate deposit refunds in writing.',
      },
      images,
    })
  }

  return properties
}

export const MOCK_PROPERTIES = generateMockProperties()
