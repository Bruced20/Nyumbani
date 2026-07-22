'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroSlide {
  slug: string
  name: string
  neighborhood: string
  houseType: string
  rentMin: number
  rentMax: number
  healthScore: number
  isVerified: boolean
  image: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  /** Milliseconds each slide stays before advancing. */
  interval?: number
}

const formatRent = (min: number, max: number) => {
  const fmt = (n: number) => `KSh ${n.toLocaleString()}`
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`
}

/**
 * Homepage hero carousel.
 * Showcases the highest-rated buildings on the platform. Auto-advances, pauses
 * on hover and when the tab is hidden, and honours prefers-reduced-motion by
 * holding on the first slide with no crossfade. Built to double as an ad slot:
 * each slide is a single image with a title, location, score and one CTA.
 */
export function HeroCarousel({ slides, interval = 6000 }: HeroCarouselProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = slides.length
  const go = useCallback((next: number) => setIndex((next + count) % count), [count])

  // Auto-advance. Skipped entirely when reduced motion is requested, when
  // paused (hover/focus), or when there is only one slide.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (reduceMotion || paused || count <= 1) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), interval)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [reduceMotion, paused, count, interval])

  // Pause while the tab is hidden so slides do not race by unseen.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (count === 0) return null
  const active = slides[index]

  return (
    <div
      className="relative w-full overflow-hidden rounded-symmetric bg-bg-secondary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Highly rated homes"
    >
      <div className="relative aspect-[20/9] sm:aspect-[32/9] w-full">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active.slug}
            initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={active.name}
              className="h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Scrim keeps the caption legible over any photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute inset-x-0 bottom-0 p-md sm:p-lg">
          <div className="flex flex-col gap-xs max-w-2xl">
            <div className="flex items-center gap-xs">
              <span className="inline-flex items-center gap-[4px] rounded-pill bg-white/95 px-[10px] py-[3px] text-[13px] font-semibold text-[#222222] shadow-sm">
                <Star size={13} className="fill-brand-primary text-brand-primary" />
                {active.healthScore.toFixed(1)}
              </span>
              {active.isVerified && (
                <span className="inline-flex items-center gap-[4px] rounded-pill bg-white/15 px-[10px] py-[3px] text-[12px] font-medium text-white backdrop-blur-sm">
                  <ShieldCheck size={13} />
                  Verified
                </span>
              )}
            </div>

            <Link href={`/property/${active.slug}`} className="group/title w-fit">
              <h2 className="text-[24px] sm:text-[30px] font-bold leading-tight text-white group-hover/title:underline underline-offset-4">
                {active.name}
              </h2>
            </Link>

            <div className="flex items-center gap-xs text-white/85 text-[14px]">
              <MapPin size={14} className="shrink-0" />
              <span>
                {active.neighborhood} · {active.houseType}
              </span>
            </div>

            <div className="flex items-center gap-sm pt-xxs">
              <span className="text-[16px] font-semibold text-white">
                {formatRent(active.rentMin, active.rentMax)}
                <span className="text-white/70 font-normal text-[13px]"> / month</span>
              </span>
              <Link
                href={`/property/${active.slug}`}
                className="inline-flex items-center rounded-soft bg-white px-sm py-[8px] text-[13px] font-semibold text-[#222222] hover:bg-white/90 transition-colors"
              >
                View home
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next — only when there is more than one slide */}
        {count > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous home"
              className="absolute left-sm top-1/2 -translate-y-1/2 h-9 w-9 rounded-pill bg-white/85 text-[#222222] flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next home"
              className="absolute right-sm top-1/2 -translate-y-1/2 h-9 w-9 rounded-pill bg-white/85 text-[#222222] flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-sm right-md flex items-center gap-[6px]">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={
                i === index
                  ? 'h-[7px] w-[18px] rounded-pill bg-white transition-all'
                  : 'h-[7px] w-[7px] rounded-pill bg-white/50 hover:bg-white/80 transition-all cursor-pointer'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
