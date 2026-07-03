import { MetadataRoute } from 'next'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

/**
 * Dynamically generated sitemap.xml configuration.
 * Gathers static pages and dynamic property detail paths.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nyumbani.co.ke'
  const currentDate = new Date()

  // 1. Static site routes
  const routes = ['', '/search', '/owners', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Dynamic property detail routes
  const propertyRoutes = MOCK_PROPERTIES.map((prop) => ({
    url: `${baseUrl}/property/${prop.slug}`,
    lastModified: new Date(prop.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...routes, ...propertyRoutes]
}
