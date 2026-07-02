export interface PropertyMock {
  id: string
  slug: string
  name: string
  neighborhood: string
  rentMin: number
  rentMax: number
  houseType: string
  waterSource: string
  internetProviders: string[]
  securityDetails: string
  depositConditions: string
  parkingSpaces: string
  roadAccess: string
  publicTransportDist: string
  healthScore: number
  isVerified: boolean
  waterRating: number
  securityRating: number
  caretakerRating: number
  imageUrl?: string
}

export const MOCK_PROPERTIES: PropertyMock[] = [
  {
    id: 'prop-1',
    slug: 'sunrise-apartments-kilimani',
    name: 'Sunrise Apartments',
    neighborhood: 'Kilimani, Nairobi',
    rentMin: 25000,
    rentMax: 32000,
    houseType: '2 Bedroom',
    waterSource: 'Borehole & Council (Reliable 24/7)',
    internetProviders: ['Safaricom Fibre', 'Zuku'],
    securityDetails: '24/7 Guard, Electric Fence, CCTV',
    depositConditions: '1 Month Rent + 1 Month Water Deposit (Fully Refunded)',
    parkingSpaces: '1 Assigned Slot',
    roadAccess: 'Tarmac Road Access',
    publicTransportDist: '5-minute walk to Kilimani Stage',
    healthScore: 4.8,
    isVerified: true,
    waterRating: 5,
    securityRating: 5,
    caretakerRating: 4.5,
  },
  {
    id: 'prop-2',
    slug: 'westlands-heights-plaza',
    name: 'Westlands Heights Plaza',
    neighborhood: 'Westlands, Nairobi',
    rentMin: 45000,
    rentMax: 60000,
    houseType: '1 & 2 Bedroom',
    waterSource: 'Council Water (Rationed on Tuesdays)',
    internetProviders: ['Safaricom Fibre', 'JamboPlay'],
    securityDetails: 'Controlled Access Gate, Guard Dogs',
    depositConditions: '2 Months Deposit (Refundable within 30 days)',
    parkingSpaces: '2 Slots per tenant',
    roadAccess: 'Cabro Paved Driveway',
    publicTransportDist: '2-minute walk to Matatu Route',
    healthScore: 3.9,
    isVerified: false,
    waterRating: 3.2,
    securityRating: 4.5,
    caretakerRating: 4.0,
  },
  {
    id: 'prop-3',
    slug: 'kileleshwa-gardens-court',
    name: 'Kileleshwa Gardens Court',
    neighborhood: 'Kileleshwa, Nairobi',
    rentMin: 55000,
    rentMax: 75000,
    houseType: '3 Bedroom',
    waterSource: 'Borehole Only (Salty, requires purifier)',
    internetProviders: ['Safaricom Fibre', 'Zuku', 'Liquid Telecom'],
    securityDetails: 'Intercom System, 2 Guard Stations',
    depositConditions: '1 Month Deposit (Refundable, but cleaning fee deducted)',
    parkingSpaces: 'Underground Parking',
    roadAccess: 'Rough Road for 200m, then Tarmac',
    publicTransportDist: '10-minute walk to nearest stage',
    healthScore: 4.2,
    isVerified: true,
    waterRating: 4.0,
    securityRating: 4.8,
    caretakerRating: 3.8,
  },
  {
    id: 'prop-4',
    slug: 'madaraka-green-villas',
    name: 'Madaraka Green Villas',
    neighborhood: 'Madaraka, Nairobi',
    rentMin: 18000,
    rentMax: 22000,
    houseType: 'Bedsitter & Single Room',
    waterSource: 'Council Water (Stored in overhead tanks)',
    internetProviders: ['Telkom Fibre', 'Safaricom Fibre'],
    securityDetails: 'Caretaker at gate, Double Lock main entrance',
    depositConditions: '1 Month Deposit (Fully Refunded after paint check)',
    parkingSpaces: 'On-street parking only',
    roadAccess: 'Cabro paved walk paths',
    publicTransportDist: '3-minute walk to Strathmore stage',
    healthScore: 2.8,
    isVerified: false,
    waterRating: 2.5,
    securityRating: 3.0,
    caretakerRating: 3.0,
  },
  {
    id: 'prop-5',
    slug: 'south-c-executive-suites',
    name: 'South C Executive Suites',
    neighborhood: 'South C, Nairobi',
    rentMin: 35000,
    rentMax: 42000,
    houseType: '1 Bedroom',
    waterSource: 'Council Water & Tanker backup',
    internetProviders: ['Safaricom Fibre', 'Zuku'],
    securityDetails: 'High gate, Razor wire fence',
    depositConditions: '1 Month Rent + 10k Electricity/Water Deposit',
    parkingSpaces: '1 Slot assigned',
    roadAccess: 'Potholed access road (floods in rainy season)',
    publicTransportDist: '8-minute walk to South C stage',
    healthScore: 3.5,
    isVerified: true,
    waterRating: 3.5,
    securityRating: 3.8,
    caretakerRating: 3.2,
  },
]

export const MOCK_NEIGHBORHOODS = [
  'Westlands',
  'Kilimani',
  'Kileleshwa',
  'Madaraka',
  'South C',
  'Langata',
  'Roysambu',
  'Syokimau',
]
