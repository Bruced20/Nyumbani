'use client'

import { useCallback, useState } from 'react'

export type LocationStatus = 'idle' | 'locating' | 'granted' | 'denied' | 'unsupported'

/**
 * Permission-gated geolocation. `request()` is only ever called from an
 * explicit user action (a button click) so the native browser permission
 * popup only appears after the visitor opts in to a feature that needs it —
 * never on page load, never just to show a property's own map.
 */
export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setStatus('granted')
      },
      () => {
        setStatus('denied')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return { status, coords, request }
}
