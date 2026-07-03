import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Middleware.
 * 1. Refreshes active user authentication tokens.
 * 2. Injects standard OWASP security headers.
 * 3. Enforces Route Protection policies.
 */
export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase Session
  const response = await updateSession(request)

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

  // Custom Content-Security-Policy (CSP) - Customizable based on final third-party resources
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' data: blob: *.supabase.co res.cloudinary.com *.unsplash.com;
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
  const sessionToken = request.cookies.get('sb-access-token')

  // Landlord Dashboard Route Protection
  if (path.startsWith('/owners/dashboard') && !sessionToken) {
    return NextResponse.redirect(new URL('/owners', request.url))
  }

  // Admin Dashboard Route Protection
  if (path.startsWith('/admin') && !sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
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
