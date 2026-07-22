'use client'

import { Navigation, MapPinned } from 'lucide-react'
import { useUserLocation } from './use-user-location'
import { distanceMeters } from '@/lib/geo'

interface DistanceDirectionsProps {
  propertyCoords: { lat: number; lng: number }
}

/**
 * "How far is this from me?" + directions.
 * The directions link needs no permission — it always opens Google Maps with
 * the property's own stored coordinates as the destination. Distance-from-me
 * is opt-in: geolocation is only requested when the visitor taps the button.
 */
export function DistanceDirections({ propertyCoords }: DistanceDirectionsProps) {
  const { status, coords, request } = useUserLocation()

  const directionsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${propertyCoords.lat},${propertyCoords.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${propertyCoords.lat},${propertyCoords.lng}`

  return (
    <div className="flex flex-col gap-sm pt-sm border-t border-border-subtle">
      <span className="text-[12px] text-text-muted">Distance from you</span>

      {status === 'granted' && coords ? (
        <p className="inline-flex items-center gap-[6px] text-[14px] font-medium text-text-primary">
          <MapPinned size={14} className="text-brand-primary shrink-0" />
          {(distanceMeters(coords, propertyCoords) / 1000).toFixed(1)} km from your location
        </p>
      ) : (
        <button
          type="button"
          onClick={request}
          disabled={status === 'locating'}
          className="w-fit text-[13px] font-semibold text-brand-primary hover:underline underline-offset-4 cursor-pointer disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'locating' ? 'Locating...' : 'See how far this is from you'}
        </button>
      )}

      {status === 'denied' && (
        <p className="text-[12px] text-status-error">
          Location permission denied — you can still get directions below.
        </p>
      )}
      {status === 'unsupported' && (
        <p className="text-[12px] text-text-muted">
          Location is not available on this device — you can still get directions below.
        </p>
      )}

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit inline-flex items-center gap-[6px] px-sm py-[8px] bg-brand-primary text-white rounded-soft text-[13px] font-semibold hover:opacity-90 transition-opacity"
      >
        <Navigation size={14} />
        Get Directions
      </a>
    </div>
  )
}
