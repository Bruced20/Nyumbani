'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NEIGHBORHOOD_COORDS } from '@/lib/geo'

export interface PinPickerProps {
  neighborhood?: string
  value: { lat: number; lng: number } | null
  onChange: (coords: { lat: number; lng: number }) => void
}

const NAIROBI: [number, number] = [-1.2864, 36.8172]

const pinIcon = () =>
  L.divIcon({
    html:
      '<div style="width:26px;height:26px;border-radius:9999px;background:#1f5e4a;' +
      'border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>',
    className: 'nyumbani-marker',
    iconSize: L.point(26, 26),
    iconAnchor: [13, 13],
  })

function ClickToPlace({ onChange }: { onChange: PinPickerProps['onChange'] }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

/** Re-centers the map when the neighbourhood select changes. */
function FollowNeighborhood({ neighborhood }: { neighborhood?: string }) {
  const map = useMap()
  React.useEffect(() => {
    if (!neighborhood) return
    const base = NEIGHBORHOOD_COORDS[neighborhood.split(',')[0].trim()]
    if (base) map.flyTo([base.lat, base.lng], 15, { duration: 0.6 })
  }, [neighborhood, map])
  return null
}

/**
 * Leaflet pin picker (client-only). Imported through pin-picker.tsx via
 * next/dynamic with ssr:false, so this module never loads on the server where
 * Leaflet's reliance on `window` would throw during prerender.
 */
export function PinPickerInner({ neighborhood, value, onChange }: PinPickerProps) {
  return (
    <MapContainer
      center={value ? [value.lat, value.lng] : NAIROBI}
      zoom={value ? 16 : 12}
      scrollWheelZoom
      className="w-full h-full min-h-[280px] rounded-soft"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPlace onChange={onChange} />
      <FollowNeighborhood neighborhood={neighborhood} />
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={pinIcon()}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const pos = (e.target as L.Marker).getLatLng()
              onChange({ lat: pos.lat, lng: pos.lng })
            },
          }}
        />
      )}
    </MapContainer>
  )
}
