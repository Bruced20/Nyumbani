import { describe, it, expect } from 'vitest'
import {
  reviewSubmissionSchema,
  reportSubmissionSchema,
  sanitizeComment,
  REPORT_REASONS,
} from './index'

const validUuid = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'

describe('reviewSubmissionSchema', () => {
  const base = {
    property_id: validUuid,
    role_tag: 'Current Resident' as const,
    water_rating: 4,
    security_rating: 5,
    caretaker_rating: 3,
    recommend: 'Yes' as const,
    comment: 'Reliable water and a friendly caretaker.',
  }

  it('accepts a well-formed submission', () => {
    expect(reviewSubmissionSchema.safeParse(base).success).toBe(true)
  })

  it('rejects ratings out of the 1-5 range', () => {
    expect(reviewSubmissionSchema.safeParse({ ...base, water_rating: 0 }).success).toBe(false)
    expect(reviewSubmissionSchema.safeParse({ ...base, security_rating: 6 }).success).toBe(false)
  })

  it('rejects a non-uuid property id', () => {
    expect(reviewSubmissionSchema.safeParse({ ...base, property_id: 'nope' }).success).toBe(false)
  })

  it('rejects an unknown role tag', () => {
    expect(reviewSubmissionSchema.safeParse({ ...base, role_tag: 'Landlord' }).success).toBe(false)
  })

  it('rejects an over-long comment', () => {
    expect(reviewSubmissionSchema.safeParse({ ...base, comment: 'a'.repeat(1001) }).success).toBe(
      false
    )
  })
})

describe('reportSubmissionSchema', () => {
  it('accepts a valid reason from the taxonomy', () => {
    expect(
      reportSubmissionSchema.safeParse({ review_id: validUuid, reason: REPORT_REASONS[0] }).success
    ).toBe(true)
  })

  it('rejects a reason outside the taxonomy', () => {
    expect(
      reportSubmissionSchema.safeParse({ review_id: validUuid, reason: 'because' }).success
    ).toBe(false)
  })

  it('rejects an over-long detail', () => {
    expect(
      reportSubmissionSchema.safeParse({
        review_id: validUuid,
        reason: REPORT_REASONS[0],
        detail: 'x'.repeat(501),
      }).success
    ).toBe(false)
  })
})

describe('sanitizeComment', () => {
  it('collapses whitespace and trims', () => {
    expect(sanitizeComment('  hello   world  ')).toBe('hello world')
  })

  it('strips control characters', () => {
    const withControls = 'a' + String.fromCharCode(0) + 'b' + String.fromCharCode(7) + 'c'
    expect(sanitizeComment(withControls)).toBe('a b c')
  })

  it('normalizes newlines and tabs to single spaces', () => {
    expect(sanitizeComment('line1\n\n\tline2')).toBe('line1 line2')
  })
})
