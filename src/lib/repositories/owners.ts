import { createClient, createStaticClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError } from '../errors'

type ClaimRow = Database['public']['Tables']['claims']['Row']
type ClaimInsert = Database['public']['Tables']['claims']['Insert']
type ClaimUpdate = Database['public']['Tables']['claims']['Update']

/**
 * Owners / Claims Database Repository.
 * Queries the claims table to manage property ownership claims.
 */
export const OwnerRepository = {
  async findById(id: string): Promise<ClaimRow | null> {
    const supabase = createStaticClient()
    const { data, error } = await supabase.from('claims').select('*').eq('id', id).maybeSingle()

    if (error) {
      throw new DatabaseError('Failed to fetch claim by ID.', { rawError: error })
    }
    return data
  },

  async findByUserId(userId: string): Promise<ClaimRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase.from('claims').select('*').eq('user_id', userId)

    if (error) {
      throw new DatabaseError('Failed to fetch claims by user ID.', { rawError: error })
    }
    return data || []
  },

  async findByPropertyId(propertyId: string): Promise<ClaimRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase.from('claims').select('*').eq('property_id', propertyId)

    if (error) {
      throw new DatabaseError('Failed to fetch claims by property ID.', { rawError: error })
    }
    return data || []
  },

  async create(claim: ClaimInsert): Promise<ClaimRow> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('claims').insert(claim).select('*').single()

    if (error) {
      throw new DatabaseError('Failed to insert ownership claim.', { rawError: error })
    }
    return data
  },

  async update(id: string, claim: ClaimUpdate): Promise<ClaimRow> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('claims')
      .update(claim)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new DatabaseError('Failed to update ownership claim.', { rawError: error })
    }
    return data
  },
}
