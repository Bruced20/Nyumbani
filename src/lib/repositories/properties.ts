import { createClient, createStaticClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError } from '../errors'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

type ImageRow = Database['public']['Tables']['property_images']['Row']
type AmenityRow = Database['public']['Tables']['property_amenities']['Row']
type NearbyRow = Database['public']['Tables']['nearby_places']['Row']

/**
 * Properties Database Repository.
 * Handles read/write actions and detailed property join queries.
 */
export const PropertyRepository = {
  async findBySlug(slug: string): Promise<{
    property: PropertyRow
    images: ImageRow[]
    amenities: AmenityRow[]
    nearbyPlaces: NearbyRow[]
  } | null> {
    const supabase = createStaticClient()

    // 1. Fetch main property row
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (propError) {
      throw new DatabaseError('Failed to fetch property by slug.', { rawError: propError })
    }
    if (!property) return null

    // 2. Fetch associated details concurrently
    const [imagesRes, amenitiesRes, nearbyRes] = await Promise.all([
      supabase
        .from('property_images')
        .select('*')
        .eq('property_id', property.id)
        .order('sort_order', { ascending: true }),
      supabase.from('property_amenities').select('*').eq('property_id', property.id),
      supabase.from('nearby_places').select('*').eq('property_id', property.id),
    ])

    return {
      property,
      images: imagesRes.data || [],
      amenities: amenitiesRes.data || [],
      nearbyPlaces: nearbyRes.data || [],
    }
  },

  async findFeatured(limit = 3): Promise<PropertyRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('health_score', { ascending: false })
      .limit(limit)

    if (error) {
      throw new DatabaseError('Failed to fetch featured properties.', { rawError: error })
    }
    return data || []
  },

  async findAll(): Promise<PropertyRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase.from('properties').select('*')

    if (error) {
      throw new DatabaseError('Failed to fetch all properties.', { rawError: error })
    }
    return data || []
  },

  async findNearby(neighborhood: string, limit = 3): Promise<PropertyRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .ilike('neighborhood', `%${neighborhood}%`)
      .limit(limit)

    if (error) {
      throw new DatabaseError('Failed to fetch nearby properties.', { rawError: error })
    }
    return data || []
  },

  async findByOwner(ownerId: string): Promise<PropertyRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('verified_owner_id', ownerId)

    if (error) {
      throw new DatabaseError('Failed to fetch properties by owner ID.', { rawError: error })
    }
    return data || []
  },

  async create(property: PropertyInsert): Promise<PropertyRow> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('properties').insert(property).select('*').single()

    if (error) {
      throw new DatabaseError('Failed to create property row.', { rawError: error })
    }
    return data
  },

  async update(id: string, property: PropertyUpdate): Promise<PropertyRow> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new DatabaseError('Failed to update property details.', { rawError: error })
    }
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) {
      throw new DatabaseError('Failed to delete property row.', { rawError: error })
    }
  },
}
