import { MetadataRoute } from 'next'

/**
 * Dynamically generated robots.txt configuration.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nyumbani.co.ke'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/owners/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
