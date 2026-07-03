import { createClient } from './server'
import { DatabaseError } from '../errors'

/**
 * Storage Helper Service for Supabase Storage buckets.
 * Buckets: 'properties', 'claims'.
 */
export const StorageService = {
  /**
   * Generates a public CDN url for an asset in a public bucket.
   */
  async getPublicUrl(bucket: 'properties' | 'claims', path: string): Promise<string> {
    const supabase = await createClient()
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  /**
   * Generates a temporary signed URL for private assets (e.g. claims documents).
   */
  async getSignedUrl(
    bucket: 'properties' | 'claims',
    path: string,
    expiresInSeconds = 3600
  ): Promise<string> {
    const supabase = await createClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds)

    if (error) {
      throw new DatabaseError('Failed to generate secure signed URL.', { rawError: error })
    }
    return data.signedUrl
  },

  /**
   * Upload an asset file. (Placeholder: uploads not active in Sprint 4A).
   */
  async uploadFile(
    bucket: 'properties' | 'claims',
    path: string,
    fileBody: Blob | Buffer | File
  ): Promise<string> {
    const supabase = await createClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, fileBody, {
      cacheControl: '3600',
      upsert: true,
    })

    if (error) {
      throw new DatabaseError('Failed to upload file to storage bucket.', { rawError: error })
    }
    return data.path
  },

  /**
   * Delete an asset file.
   */
  async deleteFile(bucket: 'properties' | 'claims', path: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw new DatabaseError('Failed to remove file from storage bucket.', { rawError: error })
    }
  },
}
