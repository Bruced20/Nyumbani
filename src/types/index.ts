import { Database } from './database.types'

// Convenient Model Mapping Shortcuts
export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Claim = Database['public']['Tables']['claims']['Row']
export type ClaimInsert = Database['public']['Tables']['claims']['Insert']
export type ClaimUpdate = Database['public']['Tables']['claims']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update']

export type UserRole = Database['public']['Tables']['profiles']['Row']['role']
export type RecommendedStatus = Database['public']['Tables']['reviews']['Row']['recommend']
export type ClaimStatus = Database['public']['Tables']['claims']['Row']['status']

// Structured review indicators mapping
export interface StructuredReviewVectors {
  water_rating: number
  security_rating: number
  caretaker_rating: number
  recommend: RecommendedStatus
  comment?: string
  role_tag: 'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor'
}
