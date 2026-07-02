'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleVariants } from '@ui/animations'
import { MapPin, Sparkles } from 'lucide-react'
import { PropertyMock } from '@/lib/mock-data'
import { HealthScore } from '@ui/badge'

interface MapPreviewProps {
  properties: PropertyMock[]
  onSelectProperty?: (slug: string) => void
}

/**
 * MapPreview: Renders a static mockup of Nairobi map by default.
 * Selecting "Open Interactive Map" loads a simulated interactive pane
 * showing clickable pins mapped to coordinate offsets.
 */
export const MapPreview: React.FC<MapPreviewProps> = ({ properties, onSelectProperty }) => {
  const [isInteractive, setIsInteractive] = React.useState(false)
  const [hoveredProperty, setHoveredProperty] = React.useState<PropertyMock | null>(null)

  // Mapped pins offsets to simulate map locations
  const pinOffsets = [
    { top: '30%', left: '40%' },
    { top: '50%', left: '60%' },
    { top: '40%', left: '70%' },
    { top: '65%', left: '30%' },
    { top: '20%', left: '50%' },
  ]

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#E5E9F0] border border-border-subtle rounded-symmetric overflow-hidden min-h-[400px]">
      {/* 1. Static Map Preview Overlay (Default state) */}
      <AnimatePresence mode="wait">
        {!isInteractive ? (
          <motion.div
            key="static"
            variants={scaleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center p-md text-center bg-slate-100 bg-opacity-95"
          >
            {/* Draw a mock cartography grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none grid grid-cols-6 grid-rows-6 border border-slate-300">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-300" />
              ))}
            </div>

            <div className="z-10 flex flex-col items-center gap-xs max-w-xs">
              <div className="h-10 w-10 bg-brand-indigo/10 text-brand-indigo rounded-pill flex items-center justify-center">
                <MapPin size={22} />
              </div>
              <h3 className="font-semibold text-[15px] text-text-primary">Nairobi Property Map</h3>
              <p className="text-[12px] text-text-muted">
                Explore local rent prices and safety scores visually on our static map preview.
              </p>
              <button
                onClick={() => setIsInteractive(true)}
                className="px-sm py-xxs bg-brand-indigo text-white font-medium rounded-soft text-[13px] hover:bg-opacity-95 transition-all cursor-pointer shadow-sm"
              >
                Open Interactive Map
              </button>
            </div>
          </motion.div>
        ) : (
          /* 2. Interactive Map Simulator (Simulates click and hover) */
          <motion.div
            key="interactive"
            variants={scaleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full bg-[#EAEDF2]"
          >
            {/* Simulated streets lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0" y1="100" x2="600" y2="400" stroke="#CBD5E1" strokeWidth="6" />
              <line x1="200" y1="0" x2="200" y2="600" stroke="#CBD5E1" strokeWidth="8" />
              <line x1="0" y1="300" x2="600" y2="200" stroke="#CBD5E1" strokeWidth="5" />
              <circle
                cx="200"
                cy="250"
                r="80"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="3"
                strokeDasharray="5"
              />
            </svg>

            {/* Clickable pins placement */}
            {properties.map((prop, idx) => {
              const offset = pinOffsets[idx % pinOffsets.length]
              return (
                <div
                  key={prop.id}
                  style={{ top: offset.top, left: offset.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                  onMouseEnter={() => setHoveredProperty(prop)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  onClick={() => onSelectProperty?.(prop.slug)}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="p-[6px] bg-brand-indigo text-white rounded-pill shadow-md flex items-center justify-center border-2 border-white"
                  >
                    <MapPin size={16} />
                  </motion.div>
                </div>
              )
            })}

            {/* Map Simulator HUD Banner */}
            <div className="absolute top-xs left-xs bg-bg-primary border border-border-subtle px-xs py-[4px] rounded-soft text-[11px] font-semibold text-text-primary shadow-sm flex items-center gap-[4px]">
              <Sparkles size={12} className="text-brand-indigo" />
              Simulated Interactive Map
              <button
                onClick={() => setIsInteractive(false)}
                className="text-text-muted hover:text-text-primary underline ml-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Hover tooltip detailing hovered property details */}
            <AnimatePresence>
              {hoveredProperty && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-xs left-xs right-xs bg-bg-primary border border-border-subtle p-xs rounded-symmetric shadow-lg flex items-center gap-xs z-20 pointer-events-none"
                >
                  <HealthScore score={hoveredProperty.healthScore} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[13px] text-text-primary truncate">
                      {hoveredProperty.name}
                    </h4>
                    <p className="text-[11px] text-text-muted truncate">
                      {hoveredProperty.neighborhood} • {hoveredProperty.rentMin.toLocaleString()}{' '}
                      KES
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
