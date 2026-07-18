import { createClient, createStaticClient } from '../supabase/server'
import { Database } from '@/types/database.types'
import { DatabaseError, DuplicateError, PG_UNIQUE_VIOLATION } from '../errors'

type ReviewRow = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

/**
 * Reviews Database Repository.
 * Handles read/write actions on the reviews table.
 */
export const ReviewRepository = {
  async findByPropertyId(propertyId: string): Promise<ReviewRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('property_id', propertyId)
      .eq('is_moderated', false)
      .order('created_at', { ascending: false })

    if (error) {
      throw new DatabaseError('Failed to fetch reviews by property ID.', { rawError: error })
    }
    return data || []
  },

  async findByUserId(userId: string): Promise<ReviewRow[]> {
    const supabase = createStaticClient()
    const { data, error } = await supabase.from('reviews').select('*').eq('user_id', userId)

    if (error) {
      throw new DatabaseError('Failed to fetch reviews by user ID.', { rawError: error })
    }
    return data || []
  },

  async create(review: ReviewInsert): Promise<ReviewRow> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('reviews').insert(review).select('*').single()

    if (error) {
      // The reviews table has unique(property_id, user_id); surface that as a
      // typed duplicate so callers can show a friendly "already reviewed" message.
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new DuplicateError('You have already reviewed this property.')
      }
      throw new DatabaseError('Failed to insert new review.', { rawError: error })
    }
    return data
  },

  async update(id: string, review: ReviewUpdate): Promise<ReviewRow> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('reviews')
      .update(review)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new DatabaseError('Failed to update review.', { rawError: error })
    }
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('reviews').delete().eq('id', id)

    if (error) {
      throw new DatabaseError('Failed to delete review.', { rawError: error })
    }
  },
}
