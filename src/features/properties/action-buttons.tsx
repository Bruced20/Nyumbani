'use client'

import React from 'react'
import { Heart, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@ui/button'

/**
 * Share & Save action buttons for property pages.
 * Handles client-side micro-animations and clipboard sharing.
 */
export const ActionButtons: React.FC = () => {
  const [isSaved, setIsSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex items-center gap-xs">
      {/* Share Button */}
      <Button onClick={handleShare} variant="outline" className="h-9 gap-xxs px-xs py-xxs">
        <Share2 size={14} />
        {copied ? 'Copied URL!' : 'Share'}
      </Button>

      {/* Save Button */}
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => setIsSaved(!isSaved)}
          variant="outline"
          className={`h-9 gap-xxs px-xs py-xxs ${isSaved ? 'text-accent-coral border-accent-coral/30 bg-accent-coral/5' : ''}`}
        >
          <Heart size={14} className={isSaved ? 'fill-accent-coral stroke-accent-coral' : ''} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
      </motion.div>
    </div>
  )
}
