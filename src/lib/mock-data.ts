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
  /**
   * Building style descriptor (orthogonal to houseType — a Two Bedroom can be
   * in a high-rise, a maisonette, or an older block). Mock-only for now;
   * promote to a real schema column + filter when categorization is needed.
   */
  buildingType: string
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

  // ---------------------------------------------------------------------------
  // Curated royalty-free photo library (Unsplash + Pexels). Every URL below has
  // been verified to return HTTP 200. Exterior pools are keyed by building
  // style so a listing's architecture matches its neighbourhood tier (a Karen
  // villa must not look like a Pipeline block); interior pools are keyed by
  // finish level. Galleries are assembled deterministically per property.
  // ---------------------------------------------------------------------------
  const uns = (id: string) => `https://images.unsplash.com/${id}?w=1200&auto=format&fit=crop&q=70`
  const pex = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`

  const EXTERIORS: Record<string, string[]> = {
    'Modern High-rise Apartment': [
      uns('photo-1459767129954-1b1c1f9b9ace'),
      uns('photo-1523192193543-6e7296d960e4'),
      pex(2462015),
    ],
    'Modern Mid-rise Apartment': [
      uns('photo-1545324418-cc1a3fa10c00'),
      uns('photo-1597047084897-51e81819a499'),
      uns('photo-1479839672679-a46483c0e7c8'),
      uns('photo-1515263487990-61b07816b324'),
    ],
    'Older Apartment Block': [
      uns('photo-1460317442991-0ec209397118'),
      uns('photo-1580216643062-cf460548a66a'),
      pex(1838640),
    ],
    'Red-brick Flats': [
      uns('photo-1430285561322-7808604715df'),
      pex(164522),
      uns('photo-1605276374104-dee2a0ed3cd6'),
    ],
    'Luxury Villa': [
      uns('photo-1613490493576-7fde63acd811'),
      uns('photo-1600596542815-ffad4c1539a9'),
      uns('photo-1580587771525-78b9dba3b914'),
      uns('photo-1512917774080-9991f1c4c750'),
      uns('photo-1564013799919-ab600027ffc6'),
      pex(8134750),
      pex(323776),
      uns('photo-1613977257363-707ba9348227'),
      uns('photo-1613977257592-4871e5fcd7c4'),
      uns('photo-1523217582562-09d0def993a6'),
      pex(462358),
      pex(1115804),
    ],
    'Gated Community Home': [
      pex(1642125),
      pex(259588),
      pex(259593),
      uns('photo-1592595896551-12b371d546d5'),
      uns('photo-1592595896616-c37162298647'),
      uns('photo-1605146769289-440113cc3d00'),
      pex(186077),
      pex(221540),
      pex(4258275),
    ],
    Maisonette: [
      pex(280229),
      pex(280222),
      pex(106399),
      uns('photo-1494526585095-c41746248156'),
      pex(7061662),
      pex(206172),
    ],
    'Standalone Bungalow': [
      uns('photo-1570129477492-45c003edd2be'),
      uns('photo-1583608205776-bfd35f0d9f83'),
      uns('photo-1625602812206-5ec545ca1231'),
      uns('photo-1628133287836-40bd5453bed1'),
      uns('photo-1599427303058-f04cbcf4756f'),
      uns('photo-1576941089067-2de3c901e126'),
      pex(1029599),
      pex(1396122),
      pex(5502227),
      pex(5997993),
    ],
    'Modern Designer Home': [
      uns('photo-1600585154340-be6161a56a0c'),
      uns('photo-1600566753190-17f0baa2a6c3'),
      uns('photo-1600585154526-990dced4db0d'),
      uns('photo-1600573472592-401b489a3cdc'),
      uns('photo-1600047509807-ba8f99d2cdde'),
      uns('photo-1600047509358-9dc75507daeb'),
      uns('photo-1600607688969-a5bfcd646154'),
      uns('photo-1600585153490-76fb20a32601'),
      pex(323780),
    ],
    'Mixed-use Building': [pex(1170686), uns('photo-1448630360428-65456885c650')],
  }

  const INTERIORS: Record<
    'luxury' | 'modern' | 'classic',
    Record<'living' | 'bedroom' | 'kitchen' | 'bathroom', string[]>
  > = {
    luxury: {
      living: [
        uns('photo-1600607687939-ce8a6c25118c'),
        uns('photo-1600566753086-00f18fb6b3ea'),
        uns('photo-1598928506311-c55ded91a20c'),
        pex(7534561),
        pex(2343468),
        pex(1648776),
        uns('photo-1600607687920-4e2a09cf159d'),
        pex(6492397),
        pex(2121121),
        uns('photo-1600047508788-786f3865b4b9'),
      ],
      bedroom: [
        uns('photo-1616594039964-ae9021a400a0'),
        pex(2467285),
        uns('photo-1617104678098-de229db51175'),
        uns('photo-1598928636135-d146006ff4be'),
      ],
      kitchen: [
        uns('photo-1556912167-f556f1f39fdf'),
        uns('photo-1600585152220-90363fe7e115'),
        pex(1438832),
        uns('photo-1628745277862-bc0b2d68c50c'),
        uns('photo-1556912173-3bb406ef7e77'),
      ],
      bathroom: [
        uns('photo-1600607688066-890987f18a86'),
        pex(6207818),
        pex(4450337),
        uns('photo-1552321554-5fefe8c9ef14'),
      ],
    },
    modern: {
      living: [
        uns('photo-1522708323590-d24dbb6b0267'),
        uns('photo-1560448204-e02f11c3d0e2'),
        uns('photo-1600210491369-e753d80a41f3'),
        uns('photo-1631679706909-1844bbd07221'),
        uns('photo-1615529182904-14819c35db37'),
        uns('photo-1613545325278-f24b0cae1224'),
        pex(1571460),
        pex(1571468),
        pex(1643383),
        pex(3209045),
        pex(6480707),
        uns('photo-1617806118233-18e1de247200'),
        uns('photo-1560185127-6ed189bf02f4'),
      ],
      bedroom: [
        uns('photo-1616486029423-aaa4789e8c9a'),
        uns('photo-1600607687644-c7171b42498f'),
        pex(271643),
        pex(9130978),
        uns('photo-1616627561839-074385245ff6'),
        pex(271624),
      ],
      kitchen: [
        uns('photo-1484154218962-a197022b5858'),
        uns('photo-1616486338812-3dadae4b4ace'),
        pex(2089696),
        pex(1080721),
        pex(2635038),
        pex(534151),
        pex(2062426),
      ],
      bathroom: [
        uns('photo-1584622650111-993a426fbf0a'),
        uns('photo-1620626011761-996317b8d101'),
        pex(6489101),
        pex(8082553),
      ],
    },
    classic: {
      living: [
        uns('photo-1502672260266-1c1ef2d93688'),
        uns('photo-1493809842364-78817add7ffb'),
        uns('photo-1554995207-c18c203602cb'),
        uns('photo-1536376072261-38c75010e6c9'),
        pex(1918291),
        uns('photo-1584622781564-1d987f7333c1'),
        uns('photo-1493663284031-b7e3aefcae8e'),
        uns('photo-1505691938895-1758d7feb511'),
        uns('photo-1599619351208-3e6c839d6828'),
        uns('photo-1600210492486-724fe5c67fb0'),
        uns('photo-1533779283484-8ad4940aa3a8'),
        pex(3356416),
        pex(1080696),
        uns('photo-1600121848594-d8644e57abab'),
        uns('photo-1560185007-cde436f6a4d0'),
        uns('photo-1560185008-b033106af5c3'),
      ],
      bedroom: [
        uns('photo-1513694203232-719a280e022f'),
        pex(323775),
        uns('photo-1524758631624-e2822e304c36'),
        uns('photo-1519710164239-da123dc03ef4'),
        pex(439227),
        pex(2029667),
        pex(3623785),
      ],
      kitchen: [uns('photo-1556909212-d5b604d0c90d'), pex(2724748), pex(280229)],
      bathroom: [uns('photo-1560448075-bb485b067938'), uns('photo-1507089947368-19c1da9775ae')],
    },
  }

  // Context shots shared across styles — compounds, entrances, streets, balconies.
  const COMPOUNDS = [uns('photo-1613553507747-5f8d62ad5904'), pex(7174102), pex(4112236)]
  const ENTRANCES = [
    pex(2079246),
    uns('photo-1628744448840-55bdb2497bd4'),
    uns('photo-1560184897-ae75f418493e'),
  ]
  const STREETS = [uns('photo-1449844908441-8829872d2607'), pex(2119713), pex(534220)]
  const BALCONIES = [pex(6527069), pex(323772)]

  // Neighbourhood character tiers — architecture must match the area.
  const NEIGHBORHOOD_TIER: Record<string, 'upscale' | 'mid' | 'budget'> = {
    Westlands: 'upscale',
    Kilimani: 'mid',
    Kileleshwa: 'upscale',
    Lavington: 'upscale',
    'South B': 'mid',
    'South C': 'mid',
    "Lang'ata": 'mid',
    Karen: 'upscale',
    Embakasi: 'budget',
    Pipeline: 'budget',
    Roysambu: 'budget',
    Kasarani: 'budget',
    Zimmerman: 'budget',
    Ruaka: 'mid',
    Ruiru: 'budget',
    Kikuyu: 'mid',
    Syokimau: 'mid',
    Mlolongo: 'budget',
    Utawala: 'budget',
    'Thika Road': 'budget',
  }

  // Building styles a listing can plausibly occupy, given its area tier and
  // unit size. houseType stays untouched — a Two Bedroom can sit in a
  // high-rise, a maisonette, or an older block; the style is orthogonal.
  const BUILDING_CANDIDATES: Record<
    'upscale' | 'mid' | 'budget',
    Record<'small' | 'medium' | 'large', string[]>
  > = {
    upscale: {
      small: ['Modern High-rise Apartment', 'Modern Mid-rise Apartment'],
      medium: ['Modern High-rise Apartment', 'Gated Community Home', 'Modern Mid-rise Apartment'],
      large: ['Luxury Villa', 'Modern Designer Home', 'Gated Community Home', 'Maisonette'],
    },
    mid: {
      small: ['Modern Mid-rise Apartment', 'Older Apartment Block', 'Mixed-use Building'],
      medium: [
        'Modern Mid-rise Apartment',
        'Red-brick Flats',
        'Older Apartment Block',
        'Maisonette',
      ],
      large: ['Maisonette', 'Gated Community Home', 'Standalone Bungalow'],
    },
    budget: {
      small: ['Older Apartment Block', 'Red-brick Flats', 'Mixed-use Building'],
      medium: ['Older Apartment Block', 'Red-brick Flats', 'Modern Mid-rise Apartment'],
      large: ['Standalone Bungalow', 'Red-brick Flats', 'Maisonette'],
    },
  }

  // Tracks how many listings already use each building style so covers rotate
  // through the style's exterior pool instead of repeating.
  const styleOccurrence: Record<string, number> = {}

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

    // ------------------------------------------------------------------
    // Building style + gallery assembly. The style is chosen from what the
    // neighbourhood tier and unit size make plausible, then the gallery is
    // composed room-by-room: exterior cover, living, bedroom, kitchen,
    // bathroom, then compound/entrance/balcony/street context. Every pick
    // rotates deterministically so same-style listings differ.
    // ------------------------------------------------------------------
    const tier = NEIGHBORHOOD_TIER[neighborhoodObj.name] ?? 'mid'
    const size =
      houseType === 'Single Room' || houseType === 'Bedsitter' || houseType === 'Studio'
        ? 'small'
        : houseType === 'Three Bedroom'
          ? 'large'
          : 'medium'
    const candidates = BUILDING_CANDIDATES[tier][size]
    // Decorrelated from the i % 6 houseType cycle so every candidate style
    // actually appears (a plain i % length always lands on the same style for
    // rare tier/size combos).
    const buildingType = candidates[(i + Math.floor(i / 8)) % candidates.length]

    const nthOfStyle = styleOccurrence[buildingType] ?? 0
    styleOccurrence[buildingType] = nthOfStyle + 1

    const finish: 'luxury' | 'modern' | 'classic' =
      tier === 'upscale' ? 'luxury' : tier === 'mid' ? 'modern' : 'classic'
    const rooms = INTERIORS[finish]
    const pick = (pool: string[], offset: number) => pool[(nthOfStyle + offset) % pool.length]

    const exteriorPool = EXTERIORS[buildingType]
    const images: string[] = [
      // Cover: always the building itself, rotated within the style's pool.
      pick(exteriorPool, 0),
      pick(rooms.living, i),
      pick(rooms.bedroom, i),
      pick(rooms.kitchen, i),
      pick(rooms.bathroom, i),
      pick(rooms.living, i + 1),
    ]
    // Larger / pricier listings show more context: second exterior angle,
    // compound, balcony. Everyone gets an entrance or street shot.
    if (exteriorPool.length > 1) images.push(pick(exteriorPool, 1))
    if (size !== 'small') images.push(pick(COMPOUNDS, i), pick(rooms.bedroom, i + 1))
    if (tier === 'upscale') images.push(pick(BALCONIES, i), pick(rooms.kitchen, i + 1))
    images.push(pick(ENTRANCES, i))
    if (i % 2 === 0) images.push(pick(STREETS, i))
    // De-duplicate while preserving order (small pools can collide).
    const gallery = [...new Set(images)]

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
        // Deterministic spread of roughly 100-700m around the neighbourhood
        // centre, so properties look realistically placed and stay put between
        // restarts (Math.random would move every pin on each seed).
        lat: neighborhoodObj.lat + (((i * 37) % 13) - 6) * 0.0011,
        lng: neighborhoodObj.lng + (((i * 53) % 13) - 6) * 0.0011,
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
      images: gallery,
      buildingType,
    })
  }

  return properties
}

export const MOCK_PROPERTIES = generateMockProperties()
