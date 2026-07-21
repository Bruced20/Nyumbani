import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { logger } from '@/lib/utils/logger'

/**
 * Next.js Middleware.
 * 1. Refreshes active user authentication tokens.
 * 2. Injects standard OWASP security headers.
 * 3. Enforces Route Protection policies.
 */
export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase Session and retrieve user details
  const { response, user, supabase } = await updateSession(request)

  // 2. Add Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' data: blob: *.supabase.co res.cloudinary.com *.unsplash.com images.pexels.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' *.supabase.co *.upstash.io;
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  response.headers.set('Content-Security-Policy', cspHeader)

  // 3. Enforce Route Protection
  const path = request.nextUrl.pathname

  // Check if target path requires authentication
  const isReviewRoute = path.startsWith('/review/new')
  const isNewPropertyRoute = path.startsWith('/properties/new')
  const isClaimRoute = path.startsWith('/owners/claim')
  const isOwnerDashboard = path.startsWith('/owners/dashboard')
  const isAdminRoute = path.startsWith('/admin')
  const isModeratorRoute = path.startsWith('/moderator')

  if (
    isReviewRoute ||
    isNewPropertyRoute ||
    isClaimRoute ||
    isOwnerDashboard ||
    isAdminRoute ||
    isModeratorRoute
  ) {
    if (!user) {
      logger.info(
        `Middleware: Guest attempted to access protected route "${path}". Redirecting to authentication.`
      )

      // Determine redirection URL with auth=required context parameter
      if (isReviewRoute || isNewPropertyRoute) {
        return NextResponse.redirect(
          new URL(`/?auth=required&next=${encodeURIComponent(path)}`, request.url)
        )
      }
      if (isClaimRoute || isOwnerDashboard) {
        return NextResponse.redirect(
          new URL(`/owners?auth=required&next=${encodeURIComponent(path)}`, request.url)
        )
      }
      return NextResponse.redirect(
        new URL(`/?auth=required&next=${encodeURIComponent(path)}`, request.url)
      )
    }

    // Role-based route authorization
    if (isAdminRoute || isModeratorRoute) {
      let userRole = 'Renter'
      if (supabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile) {
          userRole = profile.role
        }
      }

      if (isAdminRoute && userRole !== 'Admin') {
        logger.warn(
          `Middleware: Unauthorized access attempt to "/admin" by user "${user.id}" (Role: ${userRole}).`
        )
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (isModeratorRoute && userRole !== 'Moderator' && userRole !== 'Admin') {
        logger.warn(
          `Middleware: Unauthorized access attempt to "/moderator" by user "${user.id}" (Role: ${userRole}).`
        )
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
