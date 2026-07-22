'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TextInput, NumberInput } from '@ui/input'
import { Button } from '@ui/button'
import { Modal } from '@ui/overlay'
import { useToast } from '@ui/feedback/toast-context'
import { PinPicker } from './pin-picker'
import type { LocateRequest } from './pin-picker-inner'
import { createProperty, type PossibleDuplicate } from './actions'
import { KENYAN_LOCATIONS } from '@/lib/mock-data'
import { MapPin, Locate } from 'lucide-react'

const HOUSE_TYPES = [
  'Single Room',
  'Bedsitter',
  'Studio',
  'One Bedroom',
  'Two Bedroom',
  'Three Bedroom',
]
const PARKING_OPTIONS = ['Available', 'Limited', 'None']
const ROAD_OPTIONS = ['Tarmac', 'Murram', 'Seasonal']

const selectClass =
  'w-full h-11 px-sm text-[16px] sm:text-[14px] bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-primary text-text-primary cursor-pointer'

const labelClass = 'text-[13px] font-semibold text-text-primary'

/**
 * Community property submission form.
 * Anyone signed in can add a building. The location comes from a map pin, not
 * typed coordinates. Listings start as community submitted and stay unverified
 * until the owner claims them. Near-duplicates trigger a confirmation step
 * rather than a hard error.
 */
export function PropertyForm() {
  const router = useRouter()
  const toast = useToast()

  const [name, setName] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [estate, setEstate] = useState('')
  const [street, setStreet] = useState('')
  const [houseType, setHouseType] = useState('')
  const [rentMin, setRentMin] = useState('')
  const [rentMax, setRentMax] = useState('')
  const [waterSource, setWaterSource] = useState('')
  const [internet, setInternet] = useState('')
  const [security, setSecurity] = useState('')
  const [deposit, setDeposit] = useState('')
  const [parking, setParking] = useState('')
  const [road, setRoad] = useState('')
  const [transport, setTransport] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locateRequest, setLocateRequest] = useState<LocateRequest | null>(null)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
  const [confirmOccupant, setConfirmOccupant] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [duplicates, setDuplicates] = useState<PossibleDuplicate[]>([])

  const useMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocateError('Location is not available on this device.')
      return
    }
    setLocateError(null)
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        setLocateRequest({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          ts: Date.now(),
        })
      },
      () => {
        setLocating(false)
        setLocateError(
          'Could not access your location. Please allow location access and try again.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const buildPayload = () => ({
    name: name.trim(),
    neighborhood,
    estate: estate.trim() || undefined,
    street: street.trim() || undefined,
    house_type: houseType,
    rent_min: parseInt(rentMin, 10),
    rent_max: parseInt(rentMax, 10),
    water_source: waterSource.trim(),
    internet_providers: internet
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    security_details: security.trim(),
    deposit_conditions: deposit.trim(),
    parking_spaces: parking,
    road_access: road,
    public_transport_dist: transport.trim(),
    latitude: coords?.lat ?? 0,
    longitude: coords?.lng ?? 0,
  })

  const validateLocally = (): string | null => {
    if (name.trim().length < 2) return 'Give the building its real name.'
    if (!neighborhood) return 'Choose a neighbourhood.'
    if (!houseType) return 'Choose a house type.'
    const min = parseInt(rentMin, 10)
    const max = parseInt(rentMax, 10)
    if (!min || !max || min <= 0 || max <= 0) return 'Enter the monthly rent range.'
    if (min > max) return 'Minimum rent cannot be higher than maximum rent.'
    if (waterSource.trim().length < 2) return 'Describe the water source.'
    if (!internet.trim()) return 'List at least one internet option.'
    if (security.trim().length < 2) return 'Describe the security situation.'
    if (deposit.trim().length < 2) return 'Describe the deposit terms.'
    if (!parking) return 'Choose a parking option.'
    if (!road) return 'Choose the road access.'
    if (transport.trim().length < 2) return 'How far is public transport?'
    if (!coords) return 'Drop a pin on the map to mark the exact location.'
    if (!confirmOccupant)
      return 'Please confirm you live at or are authorized to list this property.'
    return null
  }

  const submit = async (allowDuplicate: boolean) => {
    const problem = validateLocally()
    if (problem) {
      setErrorMessage(problem)
      return
    }
    setErrorMessage(null)
    setSubmitting(true)
    try {
      const result = await createProperty(buildPayload(), allowDuplicate)
      if (result.success) {
        toast.success({
          message: 'Property added',
          description: 'It is now listed as community submitted.',
        })
        router.push(`/property/${result.slug}`)
      } else if ('possibleDuplicates' in result && result.possibleDuplicates) {
        setDuplicates(result.possibleDuplicates)
      } else if ('error' in result && result.error) {
        setErrorMessage(
          typeof result.error === 'object' && 'message' in result.error
            ? String(result.error.message)
            : 'Something went wrong. Please try again.'
        )
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit(false)
      }}
      className="flex flex-col gap-lg"
    >
      {/* Basics */}
      <section className="flex flex-col gap-sm">
        <h2 className="text-[16px] font-semibold text-text-primary">About the building</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <div className="flex flex-col gap-xxs md:col-span-2">
            <label className={labelClass}>Building name</label>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Green Heights Apartments"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Neighbourhood</label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className={selectClass}
            >
              <option value="">Choose an area</option>
              {KENYAN_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>House type</label>
            <select
              value={houseType}
              onChange={(e) => setHouseType(e.target.value)}
              className={selectClass}
            >
              <option value="">Choose a type</option>
              {HOUSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Estate (optional)</label>
            <TextInput
              value={estate}
              onChange={(e) => setEstate(e.target.value)}
              placeholder="e.g. Parklands"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Street (optional)</label>
            <TextInput
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Mpaka Road"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Rent from (KES / month)</label>
            <NumberInput
              value={rentMin}
              onChange={(e) => setRentMin(e.target.value)}
              placeholder="15000"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Rent to (KES / month)</label>
            <NumberInput
              value={rentMax}
              onChange={(e) => setRentMax(e.target.value)}
              placeholder="25000"
            />
          </div>
        </div>
      </section>

      {/* Location pin */}
      <section className="flex flex-col gap-sm">
        <div className="flex items-start justify-between gap-sm">
          <div className="flex flex-col gap-xxs">
            <h2 className="text-[16px] font-semibold text-text-primary">Exact location</h2>
            <p className="text-[13px] text-text-muted">
              Tap the 3D map to drop a pin, then drag it onto the building — tilt or rotate the view
              for a clearer angle. Choosing a neighbourhood above centres the map for you, or use
              your current location to narrow it down automatically.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={useMyLocation}
            disabled={locating}
            className="shrink-0 whitespace-nowrap"
          >
            <Locate size={14} className={locating ? 'animate-pulse' : ''} />
            {locating ? 'Locating...' : 'Use my location'}
          </Button>
        </div>
        {locateError && <p className="text-[12px] font-medium text-status-error">{locateError}</p>}
        <div className="h-[300px] rounded-soft overflow-hidden border border-border-subtle">
          <PinPicker
            neighborhood={neighborhood}
            value={coords}
            onChange={setCoords}
            locateRequest={locateRequest}
          />
        </div>
        {coords && (
          <p className="text-[12px] text-text-muted inline-flex items-center gap-[4px]">
            <MapPin size={12} className="text-brand-primary" />
            Pinned at {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </p>
        )}
      </section>

      {/* Quick facts */}
      <section className="flex flex-col gap-sm">
        <h2 className="text-[16px] font-semibold text-text-primary">Quick facts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Water source</label>
            <TextInput
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              placeholder="e.g. County supply with backup tank"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Internet options</label>
            <TextInput
              value={internet}
              onChange={(e) => setInternet(e.target.value)}
              placeholder="e.g. Safaricom Fibre, Zuku"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Security</label>
            <TextInput
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
              placeholder="e.g. Gated, day and night guards"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Deposit terms</label>
            <TextInput
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="e.g. One month rent, refundable"
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Parking</label>
            <select
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              className={selectClass}
            >
              <option value="">Choose an option</option>
              {PARKING_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-xxs">
            <label className={labelClass}>Road access</label>
            <select value={road} onChange={(e) => setRoad(e.target.value)} className={selectClass}>
              <option value="">Choose an option</option>
              {ROAD_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-xxs md:col-span-2">
            <label className={labelClass}>Distance to public transport</label>
            <TextInput
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              placeholder="e.g. 5 minute walk to the stage"
            />
          </div>
        </div>
      </section>

      <label className="flex items-start gap-sm text-[13px] text-text-primary cursor-pointer">
        <input
          type="checkbox"
          checked={confirmOccupant}
          onChange={(e) => setConfirmOccupant(e.target.checked)}
          className="mt-[3px] h-4 w-4 shrink-0 accent-brand-primary cursor-pointer"
        />
        I confirm I currently live at, or am authorized to list, this property.
      </label>

      {errorMessage && <p className="text-[13px] font-medium text-status-error">{errorMessage}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm border-t border-border-subtle pt-sm">
        <p className="text-[12px] text-text-muted sm:max-w-[24rem]">
          New listings appear as community submitted. The owner can claim and verify the building
          later, and reviews always stay with the property.
        </p>
        <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Adding...' : 'Add property'}
        </Button>
      </div>

      {/* Near-duplicate confirmation */}
      <Modal
        isOpen={duplicates.length > 0}
        onClose={() => setDuplicates([])}
        title="Is this the same property?"
      >
        <div className="flex flex-col gap-sm">
          <p className="text-[13px] text-text-muted">
            We found a listing with the same name close to your pin. Adding it twice would split its
            reviews.
          </p>
          <div className="flex flex-col gap-xs">
            {duplicates.map((d) => (
              <Link
                key={d.slug}
                href={`/property/${d.slug}`}
                className="flex items-center justify-between gap-xs p-sm border border-border-subtle rounded-soft hover:border-brand-primary transition-colors"
              >
                <span className="flex flex-col">
                  <span className="text-[14px] font-semibold text-text-primary">{d.name}</span>
                  <span className="text-[12px] text-text-muted">
                    {d.neighborhood} · about {d.distanceM}m from your pin
                  </span>
                </span>
                <span className="text-[13px] font-semibold text-brand-primary shrink-0">View</span>
              </Link>
            ))}
          </div>
          <div className="flex justify-end gap-xs pt-xs">
            <Button variant="outline" onClick={() => setDuplicates([])} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDuplicates([])
                submit(true)
              }}
              disabled={submitting}
            >
              It is a different building
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  )
}
