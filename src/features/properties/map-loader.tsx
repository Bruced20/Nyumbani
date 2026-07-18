'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@ui/feedback'
import type { MapProperty } from './marker-utils'

/**
 * Client-only loader for the Leaflet map. Leaflet touches `window`, so the map
 * must not server-render; the search page stays SSR while this island hydrates.
 */
const PropertyMap = dynamic(() => import('./property-map').then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[400px] rounded-symmetric" />,
})

interface PropertyMapLoaderProps {
  properties: MapProperty[]
  selectedSlug?: string | null
  onSelect?: (slug: string) => void
}

export function PropertyMapLoader(props: PropertyMapLoaderProps) {
  return <PropertyMap {...props} />
}
