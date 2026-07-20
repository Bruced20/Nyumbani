import { z } from 'zod'

// 1. Property Creation Validator
export const propertyCreateSchema = z
  .object({
    name: z.string().min(2, 'Property name must be at least 2 characters.'),
    address: z.string().optional(),
    neighborhood: z.string().min(2, 'Neighborhood name must be at least 2 characters.'),
    rent_min: z.number().int().positive('Rent minimum must be positive.'),
    rent_max: z.number().int().positive('Rent maximum must be positive.'),
    house_type: z.string().min(2, 'Specify at least one house type.'),

    // Quick Facts
    water_source: z.string().min(2, 'Describe the water source.'),
    internet_providers: z.array(z.string()).min(1, 'Identify at least one internet provider.'),
    security_details: z.string().min(2, 'Describe the security features.'),
    deposit_conditions: z.string().min(2, 'Outline the deposit terms.'),
    parking_spaces: z.string().min(2, 'Specify the parking options.'),
    road_access: z.string().min(2, 'Describe the road access.'),
    public_transport_dist: z.string().min(2, 'Detail transport proximity.'),

    // Real location from the map pin picker. Required: the map is only as good
    // as its coordinates.
    latitude: z.number().min(-5).max(5, 'Pin the property location on the map.'),
    longitude: z.number().min(33).max(42, 'Pin the property location on the map.'),
    estate: z.string().optional(),
    street: z.string().optional(),
  })
  .refine((data) => data.rent_min <= data.rent_max, {
    message: 'Minimum rent cannot exceed maximum rent.',
    path: ['rent_max'],
  })

// 2. Structured Review Validator (Aligned with the 5 vectors + Conversational Wizard)
export const reviewSubmissionSchema = z.object({
  property_id: z.string().uuid('Invalid property ID format.'),
  role_tag: z.enum(
    ['Current Resident', 'Former Resident', 'Neighbour', 'Community Contributor'] as const,
    { error: 'Please select a valid community identity role.' }
  ),

  // Structured ratings from conversational screens
  water_rating: z.number().int().min(1).max(5, 'Water rating must be between 1 and 5.'),
  security_rating: z.number().int().min(1).max(5, 'Security rating must be between 1 and 5.'),
  caretaker_rating: z.number().int().min(1).max(5, 'Caretaker rating must be between 1 and 5.'),

  recommend: z.enum(['Yes', 'Maybe', 'No'] as const, {
    error: 'Please specify if you recommend living here.',
  }),

  // Written comments (moderated text)
  comment: z.string().max(1000, 'Comments must not exceed 1000 characters.').optional(),
})

// 3. Landlord Claim Submission Validator
export const claimSubmissionSchema = z.object({
  property_id: z.string().uuid('Invalid property ID format.'),
  document_url: z.string().url('Invalid verification document storage URL.'),
})

// 4. Review Report Validator
// Reports capture WHY a review is problematic so admins can triage. Reason is a
// small fixed taxonomy plus an optional free-text detail.
export const REPORT_REASONS = [
  'Spam or advertising',
  'Offensive or abusive',
  'False or misleading',
  'Personal information',
  'Not about this property',
  'Other',
] as const

export const reportSubmissionSchema = z.object({
  review_id: z.string().uuid('Invalid review ID format.'),
  reason: z.enum(REPORT_REASONS, { error: 'Please choose a reason for reporting.' }),
  detail: z.string().max(500, 'Details must not exceed 500 characters.').optional(),
})

/**
 * Sanitize free-text review/report content before persistence:
 * trim, strip control characters, and collapse runs of whitespace. Pure.
 * The control-char class is built from a string literal so no raw control
 * bytes appear in this source file.
 */
export function sanitizeComment(input: string): string {
  const controlChars = new RegExp('[\\u0000-\\u001F\\u007F]', 'g')
  return input.replace(controlChars, ' ').replace(/\s+/g, ' ').trim()
}

// TypeScript inferred interfaces
export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>
export type ClaimSubmissionInput = z.infer<typeof claimSubmissionSchema>
export type ReportSubmissionInput = z.infer<typeof reportSubmissionSchema>
