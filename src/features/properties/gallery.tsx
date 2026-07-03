'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleVariants, SPRING_SUBTLE } from '@ui/animations'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
interface GalleryProps {
  images: string[]
}

/**
 * Reusable Hero Image Gallery.
 * Implements a responsive grid, interactive fullscreen viewer, keyboard navigation,
 * and Framer Motion spring transition animations.
 */
export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)

  // Keyboard navigation inside lightbox overlay
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % images.length)
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length])

  if (!images || images.length === 0) return null

  return (
    <div className="w-full flex flex-col gap-xs">
      {/* 1. Gallery Layout Grid (Responsive Apple/Airbnb Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-xs h-[250px] md:h-[400px] rounded-symmetric overflow-hidden border border-border-subtle relative group shadow-sm bg-neutral-100">
        {/* Main Cover Image */}
        <div className="md:col-span-3 relative h-full w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt="Property Cover" className="w-full h-full object-cover" />
        </div>

        {/* Column of side previews on Desktop */}
        <div className="hidden md:flex flex-col gap-xs h-full">
          {images.slice(1, 3).map((img, idx) => (
            <div key={idx} className="flex-1 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Property Previews ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* View all button overlay */}
        <button
          onClick={() => {
            setActiveIndex(0)
            setIsOpen(true)
          }}
          className="absolute bottom-sm right-sm px-xs py-xxs bg-bg-primary text-text-primary text-[12px] font-semibold rounded-soft border border-border-subtle hover:bg-neutral-50 shadow-md cursor-pointer transition-all flex items-center gap-[4px] select-none"
        >
          <Maximize2 size={13} />
          View Gallery
        </button>
      </div>

      {/* 2. Fullscreen Lightbox Modal (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-sm select-none"
          >
            {/* Topbar: Close button */}
            <div className="absolute top-sm right-sm flex gap-xs z-50">
              <button
                onClick={() => setIsOpen(false)}
                className="p-xxs bg-white/10 text-white hover:bg-white/20 rounded-pill transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Carousel navigation triggers */}
            <div className="absolute left-sm z-50">
              <button
                onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="p-xs bg-white/10 text-white hover:bg-white/20 rounded-pill transition-colors cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>
            </div>

            <div className="absolute right-sm z-50">
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                className="p-xs bg-white/10 text-white hover:bg-white/20 rounded-pill transition-colors cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Fullscreen Image Canvas */}
            <motion.div
              key={activeIndex}
              variants={scaleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SPRING_SUBTLE}
              className="max-w-4xl max-h-[80vh] flex items-center justify-center pointer-events-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeIndex]}
                alt={`Property Details Image ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-soft shadow-2xl"
              />
            </motion.div>

            {/* Bottombar counter indicator */}
            <div className="absolute bottom-sm text-[13px] font-medium text-white/60">
              Image {activeIndex + 1} of {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
