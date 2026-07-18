'use client'

import React from 'react'
import { Heart, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@ui/button'
import { useToast } from '@ui/feedback/toast-context'
import { useSavedProperties } from './use-saved-properties'

interface ActionButtonsProps {
  slug: string
}

/**
 * Share & Save action buttons for property pages.
 * Save persists to localStorage (anonymous-friendly) and stays consistent
 * across reloads and other places the property appears.
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({ slug }) => {
  const { isSaved, toggle } = useSavedProperties()
  const toast = useToast()
  const [copied, setCopied] = React.useState(false)
  const saved = isSaved(slug)

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success({ message: 'Link copied', description: 'Share it with anyone.' })
    } catch {
      toast.error('Could not copy the link')
    }
  }

  const handleSave = () => {
    const nowSaved = toggle(slug)
    if (nowSaved) {
      toast.success('Saved to your list')
    } else {
      toast.info('Removed from your list')
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
          onClick={handleSave}
          variant="outline"
          className={`h-9 gap-xxs px-xs py-xxs ${saved ? 'text-status-error border-status-error/30 bg-status-error/5' : ''}`}
        >
          <Heart size={14} className={saved ? 'fill-status-error stroke-status-error' : ''} />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </motion.div>
    </div>
  )
}
