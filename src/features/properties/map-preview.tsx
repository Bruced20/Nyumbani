'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleVariants, SPRING_SUBTLE } from '@ui/animations'
import { MapPin, Sparkles, Maximize2, Minimize2 } from 'lucide-react'
import { Property } from '@/lib/mappers'
import { HealthScore } from '@ui/badge'
import { cn } from '@/lib/utils'

interface MapPreviewProps {
  properties: Property[]
  onSelectProperty?: (slug: string) => void
}

/**
 * Mapped MapPreview Component.
 * Supports static cartography mockup, clicking "Open Interactive Map" to enter interactive simulator,
 * and clicking "Expand / Collapse" buttons to grow/shrink layout bounds with spring animations.
 */
export const MapPreview: React.FC<MapPreviewProps> = ({ properties, onSelectProperty }) => {
  const [isInteractive, setIsInteractive] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [hoveredProperty, setHoveredProperty] = React.useState<Property | null>(null)

  // Pin offsets coordinates to place indicators on the canvas
  const pinOffsets = [
    { top: '35%', left: '30%' },
    { top: '50%', left: '55%' },
    { top: '42%', left: '72%' },
    { top: '65%', left: '25%' },
    { top: '22%', left: '48%' },
    { top: '75%', left: '50%' },
    { top: '15%', left: '68%' },
    { top: '58%', left: '80%' },
    { top: '30%', left: '15%' },
    { top: '80%', left: '20%' },
  ]

  return (
    <motion.div
      layout
      transition={SPRING_SUBTLE}
      className={cn(
        'w-full bg-[#E5E9F0] border border-border-subtle rounded-symmetric overflow-hidden shadow-sm relative flex flex-col items-center justify-center transition-all duration-300',
        isExpanded ? 'h-[calc(100vh-100px)] lg:h-[calc(100vh-100px)] z-30' : 'h-[400px] lg:h-full'
      )}
    >
      {/* 1. Expand / Collapse Trigger overlay */}
      <div className="absolute top-xs right-xs z-20 flex gap-xxs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-xxs bg-bg-primary text-text-primary border border-border-subtle rounded-pill hover:bg-neutral-50 shadow-sm cursor-pointer"
          title={isExpanded ? 'Collapse Map' : 'Expand Map'}
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isInteractive ? (
          /* Static Cartography Grid Overlay */
          <motion.div
            key="static"
            variants={scaleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center p-md text-center bg-slate-100 bg-opacity-95"
          >
            {/* Draw mapping coordinates */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 grid-rows-6 border border-slate-300">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-300" />
              ))}
            </div>

            <div className="z-10 flex flex-col items-center gap-xs max-w-xs">
              <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-pill flex items-center justify-center">
                <MapPin size={22} />
              </div>
              <h3 className="font-semibold text-[15px] text-text-primary">Nairobi Map View</h3>
              <p className="text-[12px] text-text-muted">
                Locate verified properties across 20 Nairobi neighborhoods with active quality
                metrics.
              </p>
              <button
                onClick={() => setIsInteractive(true)}
                className="px-sm py-xxs bg-brand-primary text-white font-medium rounded-soft text-[13px] hover:bg-opacity-95 transition-all cursor-pointer shadow-sm"
              >
                Open Interactive Map
              </button>
            </div>
          </motion.div>
        ) : (
          /* Mapped pins simulator */
          <motion.div
            key="interactive"
            variants={scaleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full bg-[#EAEDF2]"
          >
            {/* Simulated cartography streets lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0" y1="120" x2="800" y2="450" stroke="#CBD5E1" strokeWidth="6" />
              <line x1="220" y1="0" x2="220" y2="800" stroke="#CBD5E1" strokeWidth="8" />
              <line x1="0" y1="350" x2="800" y2="280" stroke="#CBD5E1" strokeWidth="5" />
              <circle
                cx="220"
                cy="280"
                r="100"
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
                    className="p-[6px] bg-brand-primary text-white rounded-pill shadow-md flex items-center justify-center border-2 border-white"
                  >
                    <MapPin size={15} />
                  </motion.div>
                </div>
              )
            })}

            {/* HUD Status Bar */}
            <div className="absolute top-xs left-xs bg-bg-primary border border-border-subtle px-xs py-[4px] rounded-soft text-[11px] font-semibold text-text-primary shadow-sm flex items-center gap-[4px] z-10">
              <Sparkles size={12} className="text-brand-primary animate-pulse" />
              Interactive Map Simulator
              <button
                onClick={() => setIsInteractive(false)}
                className="text-text-muted hover:text-text-primary underline ml-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Tooltip detail block */}
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
                      {hoveredProperty.neighborhood} • {hoveredProperty.rentMin.toLocaleString()} -{' '}
                      {hoveredProperty.rentMax.toLocaleString()} KES
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
