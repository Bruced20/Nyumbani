'use client'

import React from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

/**
 * useFocusTrap: shared keyboard accessibility behavior for overlay surfaces
 * (Modal, Drawer, and future dialogs).
 *
 * - Traps Tab / Shift+Tab focus cycling inside the container
 * - Closes on Escape
 * - Moves focus into the container on open (first focusable, else container)
 * - Restores focus to the previously focused element on close
 *
 * `onClose` is kept in a ref so parents passing inline arrow functions do not
 * re-run the trap (and re-capture the restore target) on every render.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void
) {
  const onCloseRef = React.useRef(onClose)
  React.useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = containerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR)
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const lastActiveElement = document.activeElement as HTMLElement | null

    const focusTimer = setTimeout(() => {
      const focusable = containerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusable && focusable.length > 0) {
        ;(focusable[0] as HTMLElement).focus()
      } else {
        containerRef.current?.focus()
      }
    }, 50)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(focusTimer)
      lastActiveElement?.focus()
    }
  }, [isOpen, containerRef])
}
