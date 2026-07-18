export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'Renter' | 'Owner' | 'Moderator' | 'Admin'
          created_at: string
          updated_at: string
          last_login_at: string | null
          provider: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'Renter' | 'Owner' | 'Moderator' | 'Admin'
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          provider?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'Renter' | 'Owner' | 'Moderator' | 'Admin'
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          provider?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          slug: string
          name: string
          address: string | null
          neighborhood: string
          rent_min: number
          rent_max: number
          house_type: string
          water_source: string
          internet_providers: string[]
          security_details: string
          deposit_conditions: string
          parking_spaces: string
          road_access: string
          public_transport_dist: string
          health_score: number
          is_verified: boolean
          verified_owner_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          address?: string | null
          neighborhood: string
          rent_min: number
          rent_max: number
          house_type: string
          water_source: string
          internet_providers: string[]
          security_details: string
          deposit_conditions: string
          parking_spaces: string
          road_access: string
          public_transport_dist: string
          health_score?: number
          is_verified?: boolean
          verified_owner_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          address?: string | null
          neighborhood?: string
          rent_min?: number
          rent_max?: number
          house_type?: string
          water_source?: string
          internet_providers?: string[]
          security_details?: string
          deposit_conditions?: string
          parking_spaces?: string
          road_access?: string
          public_transport_dist?: string
          health_score?: number
          is_verified?: boolean
          verified_owner_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          property_id: string
          user_id: string
          role_tag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
          water_rating: number
          security_rating: number
          caretaker_rating: number
          recommend: 'Yes' | 'Maybe' | 'No'
          comment: string | null
          is_moderated: boolean
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          role_tag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
          water_rating: number
          security_rating: number
          caretaker_rating: number
          recommend: 'Yes' | 'Maybe' | 'No'
          comment?: string | null
          is_moderated?: boolean
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          role_tag?: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
          water_rating?: number
          security_rating?: number
          caretaker_rating?: number
          recommend?: 'Yes' | 'Maybe' | 'No'
          comment?: string | null
          is_moderated?: boolean
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          id: string
          property_id: string
          user_id: string
          document_url: string
          status: 'Pending' | 'Approved' | 'Rejected'
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          document_url: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          document_url?: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          review_id: string
          reporter_id: string
          reason: string
          is_resolved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          reporter_id: string
          reason: string
          is_resolved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          reporter_id?: string
          reason?: string
          is_resolved?: boolean
          created_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity: string
          entity_id: string | null
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          created_at?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          created_at?: string
        }
        Relationships: []
      }
      property_amenities: {
        Row: {
          id: string
          property_id: string
          amenity_name: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          amenity_name: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          amenity_name?: string
          created_at?: string
        }
        Relationships: []
      }
      nearby_places: {
        Row: {
          id: string
          property_id: string
          name: string
          type: string
          distance: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          type: string
          distance: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          type?: string
          distance?: string
          created_at?: string
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          id: string
          review_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      moderation_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity: string
          entity_id: string
          reason: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          entity: string
          entity_id: string
          reason?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          entity?: string
          entity_id?: string
          reason?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
