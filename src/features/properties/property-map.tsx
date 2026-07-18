'use client'

import React from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { HealthScore, VerifiedOwnerBadge } from '@ui/badge'
import { BottomSheet } from '@ui/overlay'
import { Star } from 'lucide-react'
import {
  buildMarkerHtml,
  buildClusterHtml,
  formatCompactKes,
  markerTrustTier,
  type MapProperty,
} from './marker-utils'

interface PropertyMapProps {
  properties: MapProperty[]
  selectedSlug?: string | null
  onSelect?: (slug: string) => void
}

// Nairobi center — sensible default before markers fit bounds.
const NAIROBI: [number, number] = [-1.2864, 36.8172]

/**
 * Imperative marker + cluster layer.
 * Rebuilds the cluster group when `properties` change (filter updates) and
 * flies to / re-highlights the selected marker. Kept imperative so hundreds of
 * markers never hit React reconciliation.
 */
function MarkerLayer({
  properties,
  selectedSlug,
  onMarkerActivate,
  onMarkerHover,
}: {
  properties: MapProperty[]
  selectedSlug?: string | null
  onMarkerActivate: (p: MapProperty) => void
  onMarkerHover: (p: MapProperty | null) => void
}) {
  const map = useMap()
  const clusterRef = React.useRef<L.MarkerClusterGroup | null>(null)
  const markerBySlug = React.useRef<Map<string, L.Marker>>(new Map())

  // Build / rebuild markers whenever the property set changes.
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cluster = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 55,
      iconCreateFunction: (c: L.MarkerCluster) =>
        L.divIcon({
          html: buildClusterHtml(c.getChildCount()),
          className: 'nyumbani-cluster',
          iconSize: L.point(40, 40),
        }),
    }) as L.MarkerClusterGroup

    const bySlug = new Map<string, L.Marker>()

    properties.forEach((property) => {
      const { lat, lng } = property.coordinates
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: buildMarkerHtml(property, { selected: property.slug === selectedSlug }),
          className: 'nyumbani-marker',
          iconSize: L.point(0, 0), // let content size itself
          iconAnchor: [0, 0],
        }),
      })

      marker.on('click', () => onMarkerActivate(property))
      marker.on('mouseover', () => onMarkerHover(property))
      marker.on('mouseout', () => onMarkerHover(null))

      bySlug.set(property.slug, marker)
      cluster.addLayer(marker)
    })

    map.addLayer(cluster)
    clusterRef.current = cluster
    markerBySlug.current = bySlug

    // Fit to markers on (re)build when there are any.
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((p) => [p.coordinates.lat, p.coordinates.lng] as [number, number])
      )
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 })
    }

    return () => {
      map.removeLayer(cluster)
      clusterRef.current = null
      markerBySlug.current = new Map()
    }
  }, [properties, map, onMarkerActivate, onMarkerHover, selectedSlug])

  // Re-style + fly to the selected marker without rebuilding the layer.
  React.useEffect(() => {
    if (!selectedSlug) return
    const selected = properties.find((p) => p.slug === selectedSlug)
    if (!selected) return

    markerBySlug.current.forEach((marker, slug) => {
      const p = properties.find((x) => x.slug === slug)
      if (!p) return
      marker.setIcon(
        L.divIcon({
          html: buildMarkerHtml(p, { selected: slug === selectedSlug }),
          className: 'nyumbani-marker',
          iconSize: L.point(0, 0),
          iconAnchor: [0, 0],
        })
      )
    })

    map.flyTo([selected.coordinates.lat, selected.coordinates.lng], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    })
  }, [selectedSlug, properties, map])

  return null
}

/**
 * Shared preview card body — used by the desktop floating card and the mobile
 * bottom sheet. Shows only real signals: image, name, location, rent, Health
 * Score, review count, and a verified badge when applicable.
 */
function PreviewCardBody({ property, onView }: { property: MapProperty; onView: () => void }) {
  const tier = markerTrustTier(property)
  return (
    <div className="flex flex-col gap-sm">
      <div className="relative w-full aspect-[16/10] rounded-soft overflow-hidden bg-bg-primary">
        {property.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-[12px]">
            No image
          </div>
        )}
        {tier === 'featured' && (
          <span className="absolute top-xs left-xs inline-flex items-center gap-[3px] px-xs py-[3px] rounded-pill bg-amber-400 text-white text-[11px] font-semibold shadow-sm">
            <Star size={12} className="fill-white" /> Featured
          </span>
        )}
        <div className="absolute top-xs right-xs">
          <HealthScore score={property.healthScore} />
        </div>
      </div>

      <div className="flex items-start justify-between gap-xs">
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] text-text-primary truncate">{property.name}</h3>
          <p className="text-[13px] text-text-muted truncate">{property.neighborhood}</p>
        </div>
        {property.isVerified && <VerifiedOwnerBadge />}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-text-primary">
          {formatCompactKes(property.rentMin)}
          <span className="text-text-muted font-normal text-[12px]"> / month</span>
        </span>
        <span className="text-[12px] text-text-muted">
          {property.reviewCount} {property.reviewCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <Link
        href={`/property/${property.slug}`}
        onClick={onView}
        className="w-full text-center px-sm py-[10px] bg-brand-primary text-white font-semibold rounded-soft text-[14px] hover:bg-brand-primary/90 transition-colors min-h-[44px] flex items-center justify-center"
      >
        View Property
      </Link>
    </div>
  )
}

/**
 * Real interactive Leaflet map with Airbnb-style trust-aware price markers,
 * clustering, and a hover (desktop) / tap (mobile) preview card.
 */
export function PropertyMap({ properties, selectedSlug, onSelect }: PropertyMapProps) {
  const shouldReduceMotion = useReducedMotion()
  const [hovered, setHovered] = React.useState<MapProperty | null>(null)
  const [sheetProperty, setSheetProperty] = React.useState<MapProperty | null>(null)

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  const handleActivate = React.useCallback(
    (p: MapProperty) => {
      onSelect?.(p.slug)
      if (window.matchMedia('(max-width: 768px)').matches) {
        setSheetProperty(p)
      } else {
        setHovered(p)
      }
    },
    [onSelect]
  )

  const handleHover = React.useCallback((p: MapProperty | null) => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    setHovered(p)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <MapContainer
        center={NAIROBI}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full min-h-[400px] rounded-symmetric"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerLayer
          properties={properties}
          selectedSlug={selectedSlug}
          onMarkerActivate={handleActivate}
          onMarkerHover={handleHover}
        />
      </MapContainer>

      {/* Desktop floating preview card */}
      <AnimatePresence>
        {hovered && !isMobile && (
          <motion.div
            key={hovered.slug}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }
            }
            onMouseEnter={() => setHovered(hovered)}
            onMouseLeave={() => setHovered(null)}
            className="absolute bottom-sm left-sm right-sm sm:right-auto sm:w-[300px] z-[400] bg-bg-secondary border border-border-subtle rounded-symmetric shadow-lg p-sm"
          >
            <PreviewCardBody property={hovered} onView={() => onSelect?.(hovered.slug)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet, synced to the tapped marker */}
      <BottomSheet
        isOpen={!!sheetProperty}
        onClose={() => setSheetProperty(null)}
        title={sheetProperty?.name || 'Property'}
      >
        {sheetProperty && (
          <PreviewCardBody property={sheetProperty} onView={() => setSheetProperty(null)} />
        )}
      </BottomSheet>
    </div>
  )
}

export default PropertyMap
