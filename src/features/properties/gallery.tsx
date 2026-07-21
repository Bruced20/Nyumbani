'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { scaleVariants, SPRING_SUBTLE, backdropVariants } from '@ui/animations'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

interface GalleryProps {
  images: string[]
}

// Shared responsive sizes hint — cover spans ~75% of a max-w container on desktop.
const COVER_SIZES = '(max-width: 768px) 100vw, 75vw'
const PREVIEW_SIZES = '(max-width: 768px) 0px, 25vw'

/**
 * Reusable Hero Image Gallery (Airbnb-style).
 * Responsive grid preview, fullscreen lightbox with keyboard navigation,
 * touch/swipe gestures, a thumbnail filmstrip, and next/image optimization
 * (lazy loading + responsive sizing, blur-free layout stability via `fill`).
 */
export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const thumbStripRef = React.useRef<HTMLDivElement | null>(null)

  const goNext = React.useCallback(
    () => setActiveIndex((prev) => (prev + 1) % images.length),
    [images.length]
  )
  const goPrev = React.useCallback(
    () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  )

  const open = (index: number) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  // Keyboard navigation inside lightbox overlay
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goNext, goPrev])

  // Lock body scroll while the lightbox is open
  React.useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Keep the active thumbnail scrolled into view within the filmstrip
  React.useEffect(() => {
    if (!isOpen) return
    const strip = thumbStripRef.current
    if (!strip) return
    const activeThumb = strip.querySelector<HTMLElement>(`[data-thumb-index="${activeIndex}"]`)
    activeThumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeIndex, isOpen])

  // Swipe gesture handling for touch devices
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const threshold = 60
    if (info.offset.x < -threshold) goNext()
    else if (info.offset.x > threshold) goPrev()
  }

  if (!images || images.length === 0) return null

  const previews = images.slice(1, 3)

  return (
    <div className="w-full flex flex-col gap-xs">
      {/* 1. Gallery Layout Grid (Responsive Apple/Airbnb Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-xs h-[250px] md:h-[400px] rounded-symmetric overflow-hidden border border-border-subtle relative group shadow-sm bg-bg-secondary">
        {/* Main Cover Image */}
        <button
          type="button"
          onClick={() => open(0)}
          aria-label="Open gallery"
          className="md:col-span-3 relative h-full w-full overflow-hidden cursor-pointer"
        >
          <Image
            src={images[0]}
            alt="Property cover photograph"
            fill
            priority
            sizes={COVER_SIZES}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>

        {/* Column of side previews on Desktop */}
        <div className="hidden md:flex flex-col gap-xs h-full">
          {previews.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => open(idx + 1)}
              aria-label={`Open gallery at photo ${idx + 2}`}
              className="flex-1 relative overflow-hidden cursor-pointer"
            >
              <Image
                src={img}
                alt={`Property preview ${idx + 1}`}
                fill
                sizes={PREVIEW_SIZES}
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* View all button overlay */}
        <button
          type="button"
          onClick={() => open(0)}
          className="absolute bottom-sm right-sm px-xs py-xxs bg-bg-primary text-text-primary text-[12px] font-semibold rounded-soft border border-border-subtle hover:bg-neutral-50 shadow-md cursor-pointer transition-all flex items-center gap-[4px] select-none"
        >
          <Maximize2 size={13} />
          View all {images.length} photos
        </button>
      </div>

      {/* 2. Fullscreen Lightbox Modal (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Property photo gallery"
            className="fixed inset-0 bg-black/95 z-50 flex flex-col select-none"
          >
            {/* Topbar: counter + close button */}
            <div className="flex items-center justify-between px-sm py-xs z-50 text-white/80">
              <span className="text-[13px] font-medium">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close gallery"
                className="p-xxs bg-white/10 text-white hover:bg-white/20 rounded-pill transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main stage */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden px-sm">
              {/* Prev/Next (hidden on small screens where swipe is primary) */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="hidden sm:flex absolute left-sm z-50 p-xs bg-white/10 text-white hover:bg-white/20 rounded-pill transition-colors cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <motion.div
                key={activeIndex}
                variants={scaleVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SPRING_SUBTLE}
                drag={images.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center touch-pan-y"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`Property photograph ${activeIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain rounded-soft pointer-events-none"
                />
              </motion.div>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="hidden sm:flex absolute right-sm z-50 p-xs bg-white/10 text-white hover:bg-white/20 rounded-pill transition-colors cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Thumbnail filmstrip */}
            <div
              ref={thumbStripRef}
              className="flex gap-xs overflow-x-auto px-sm py-xs scrollbar-thin"
            >
              {images.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  data-thumb-index={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View photo ${idx + 1}`}
                  aria-current={idx === activeIndex}
                  className={`relative h-[56px] w-[80px] flex-shrink-0 overflow-hidden rounded-soft transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
