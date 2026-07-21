/**
 * One-off reseed: wipe all property rows (children cascade) and re-insert the
 * 52 mock properties with the new galleries + sort_order. Mirrors the exact
 * insert logic in src/lib/services/properties.ts ensureSeeded so production
 * data stays faithful. Run with: npx tsx scripts/reseed.ts
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { MOCK_PROPERTIES } from '../src/lib/mock-data'

const env: Record<string, string> = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const SEED_USER_BY_ROLE: Record<string, string> = {
  'Current Resident': '00000000-0000-0000-0000-000000000001',
  'Former Resident': '00000000-0000-0000-0000-000000000002',
  Neighbour: '00000000-0000-0000-0000-000000000003',
  'Community Contributor': '00000000-0000-0000-0000-000000000004',
}

async function main() {
  // 0. Guard: verify sort_order exists before wiping anything.
  const probe = await sb.from('property_images').select('id,sort_order').limit(1)
  if (probe.error) {
    console.error('ABORT: property_images.sort_order missing. Apply the migration first.')
    console.error(probe.error.message)
    process.exit(1)
  }

  // 1. Wipe existing properties (children cascade via FK on delete cascade).
  const del = await sb.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (del.error) {
    console.error('Delete failed:', del.error.message)
    process.exit(1)
  }
  const { count: after } = await sb.from('properties').select('*', { count: 'exact', head: true })
  console.log('properties after wipe:', after)

  // 2. Re-insert all 52 mock properties + children.
  let ok = 0
  for (const mock of MOCK_PROPERTIES) {
    const { data: propRow, error: propErr } = await sb
      .from('properties')
      .insert({
        slug: mock.slug,
        name: mock.name,
        neighborhood: mock.neighborhood,
        latitude: mock.coordinates.lat,
        longitude: mock.coordinates.lng,
        county: 'Nairobi',
        rent_min: mock.rentMin,
        rent_max: mock.rentMax,
        house_type: mock.houseType,
        water_source: mock.waterSource,
        internet_providers:
          mock.internetType === 'Fiber Available'
            ? ['Safaricom Fibre', 'Zuku']
            : ['Mobile Internet'],
        security_details: `${mock.securityRating} security standard`,
        deposit_conditions: mock.deposit,
        parking_spaces: mock.parking,
        road_access: mock.roadType,
        public_transport_dist: mock.distanceFromRoad,
        health_score: mock.healthScore,
        is_verified: mock.isVerified,
      })
      .select('id')
      .single()

    if (propErr || !propRow) {
      console.error(`property insert failed for ${mock.slug}:`, propErr?.message)
      continue
    }
    const propertyId = propRow.id

    const imgRes = await sb
      .from('property_images')
      .insert(
        mock.images.map((image_url, index) => ({
          property_id: propertyId,
          image_url,
          sort_order: index,
        }))
      )
    if (imgRes.error) console.error(`images failed ${mock.slug}:`, imgRes.error.message)

    const amRes = await sb
      .from('property_amenities')
      .insert(mock.amenities.map((amenity_name) => ({ property_id: propertyId, amenity_name })))
    if (amRes.error) console.error(`amenities failed ${mock.slug}:`, amRes.error.message)

    const npRes = await sb.from('nearby_places').insert(
      mock.nearbyPlaces.map((p) => ({
        property_id: propertyId,
        name: p.name,
        type: p.type,
        distance: p.distance,
      }))
    )
    if (npRes.error) console.error(`nearby failed ${mock.slug}:`, npRes.error.message)

    const revRes = await sb.from('reviews').insert(
      mock.reviews.map((rev) => ({
        property_id: propertyId,
        user_id: SEED_USER_BY_ROLE[rev.role] ?? SEED_USER_BY_ROLE['Current Resident'],
        role_tag: rev.role,
        water_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
        security_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
        caretaker_rating: rev.rating >= 4.5 ? 5 : rev.rating >= 3.5 ? 4 : 3,
        recommend: rev.rating >= 4.0 ? 'Yes' : 'Maybe',
        comment: rev.comment,
        is_moderated: false,
      }))
    )
    if (revRes.error) console.error(`reviews failed ${mock.slug}:`, revRes.error.message)

    ok++
  }
  console.log(`re-seeded ${ok}/${MOCK_PROPERTIES.length} properties`)

  // 3. Verify image counts.
  const { count: imgCount } = await sb
    .from('property_images')
    .select('*', { count: 'exact', head: true })
  console.log('total property_images:', imgCount)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
