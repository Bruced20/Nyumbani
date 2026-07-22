import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/properties'

/**
 * Batch property lookup for client-only slug lists (e.g. localStorage saved
 * properties) that can't be resolved during server render.
 * `/api/properties/by-slugs?slugs=a,b,c`
 */
export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get('slugs') || ''
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (slugs.length === 0) {
    return NextResponse.json({ properties: [] })
  }

  const properties = await PropertyService.getBySlugs(slugs)
  return NextResponse.json({ properties })
}
