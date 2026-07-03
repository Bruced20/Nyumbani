import { createClient, createStaticClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError } from '../errors'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Profiles Database Repository.
 * Executes SELECT, INSERT, and UPDATE queries on the profiles table.
 */
export const ProfileRepository = {
  async findById(id: string): Promise<ProfileRow | null> {
    const supabase = createStaticClient()
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()

    if (error) {
      throw new DatabaseError('Failed to fetch profile by ID.', { rawError: error })
    }
    return data
  },

  async create(profile: ProfileInsert): Promise<ProfileRow> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').insert(profile).select('*').single()

    if (error) {
      throw new DatabaseError('Failed to create new user profile.', { rawError: error })
    }
    return data
  },

  async update(id: string, profile: ProfileUpdate): Promise<ProfileRow> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new DatabaseError('Failed to update profile details.', { rawError: error })
    }
    return data
  },
}
