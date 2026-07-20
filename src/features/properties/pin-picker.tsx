'use client'

import type React from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@ui/feedback'
import type { PinPickerProps } from './pin-picker-inner'

/**
 * Map pin picker for the property upload form. The user taps the map to drop a
 * pin, then drags it onto the exact building; selecting a neighbourhood
 * re-centers the view.
 *
 * Leaflet touches `window`, so the real implementation lives in
 * pin-picker-inner.tsx and is loaded client-side only. Importing it through
 * next/dynamic (ssr:false) keeps Leaflet out of the server bundle so the
 * upload page prerenders cleanly.
 */
export const PinPicker = dynamic(() => import('./pin-picker-inner').then((m) => m.PinPickerInner), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[280px] rounded-soft" />,
}) as React.ComponentType<PinPickerProps>
