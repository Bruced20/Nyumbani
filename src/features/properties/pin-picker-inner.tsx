'use client'

import React from 'react'
import { Map as MapLibreMap, Marker, NavigationControl, type MapMouseEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { NEIGHBORHOOD_COORDS } from '@/lib/geo'

export interface LocateRequest {
  lat: number
  lng: number
  ts: number
}

export interface PinPickerProps {
  neighborhood?: string
  value: { lat: number; lng: number } | null
  onChange: (coords: { lat: number; lng: number }) => void
  /** Set by a "use my location" button — recenters the map only, never the pin. */
  locateRequest?: LocateRequest | null
}

const NAIROBI: [number, number] = [36.8172, -1.2864]
const DEFAULT_PITCH = 55
const DEFAULT_BEARING = -17.6

/** Free, no-API-key vector style with a built-in 3D fill-extrusion buildings layer. */
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/**
 * MapLibre GL pin picker (client-only, touches `window`). Loaded through
 * pin-picker.tsx via next/dynamic with ssr:false. Renders in 3D (pitched,
 * building-extrusion) so a user can tilt/rotate to line the pin up with the
 * actual building rather than guessing from directly overhead.
 */
export function PinPickerInner({ neighborhood, value, onChange, locateRequest }: PinPickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<MapLibreMap | null>(null)
  const markerRef = React.useRef<Marker | null>(null)
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Initialize once.
  React.useEffect(() => {
    if (!containerRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: value ? [value.lng, value.lat] : NAIROBI,
      zoom: value ? 16 : 12,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
    })
    mapRef.current = map

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right')

    map.on('click', (e: MapMouseEvent) => {
      onChangeRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    })

    if (value) {
      const marker = new Marker({ color: '#1f5e4a', draggable: true })
        .setLngLat([value.lng, value.lat])
        .addTo(map)
      marker.on('dragend', () => {
        const pos = marker.getLngLat()
        onChangeRef.current({ lat: pos.lat, lng: pos.lng })
      })
      markerRef.current = marker
    }

    return () => {
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; value/onChange handled by dedicated effects below
  }, [])

  // Keep the marker in sync with the current pin, creating it on first placement.
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !value) return

    if (!markerRef.current) {
      const marker = new Marker({ color: '#1f5e4a', draggable: true })
        .setLngLat([value.lng, value.lat])
        .addTo(map)
      marker.on('dragend', () => {
        const pos = marker.getLngLat()
        onChangeRef.current({ lat: pos.lat, lng: pos.lng })
      })
      markerRef.current = marker
    } else {
      markerRef.current.setLngLat([value.lng, value.lat])
    }
  }, [value])

  // Re-center when the neighbourhood select changes.
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !neighborhood) return
    const base = NEIGHBORHOOD_COORDS[neighborhood.split(',')[0].trim()]
    if (base) {
      map.flyTo({ center: [base.lng, base.lat], zoom: 15, pitch: DEFAULT_PITCH, duration: 600 })
    }
  }, [neighborhood])

  // Re-center on the user's real position — never moves the pin itself.
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !locateRequest) return
    map.flyTo({
      center: [locateRequest.lng, locateRequest.lat],
      zoom: 17,
      pitch: DEFAULT_PITCH,
      duration: 1200,
    })
  }, [locateRequest])

  return <div ref={containerRef} className="w-full h-full min-h-[280px] rounded-soft" />
}
