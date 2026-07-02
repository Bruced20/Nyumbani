'use client'

import React from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import {
  backdropVariants,
  modalVariants,
  slideUpVariants,
  scaleVariants,
  slideLeftVariants,
  fadeVariants,
} from '../animations'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/**
 * Custom Modal dialog with animated overlay and content cards.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-sm">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Dialog Container */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            className="bg-bg-primary border border-border-subtle rounded-symmetric w-full max-w-md p-sm relative shadow-xl z-10"
          >
            <header className="flex justify-between items-center mb-xs">
              <h3 className="font-semibold text-subtitle text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </header>
            <div className="text-[14px] text-text-muted leading-relaxed mt-xxs">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  position?: 'left' | 'right'
}

/**
 * Drawer Component: Slide-in panel (usually for menus or settings sidebar).
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const transitionVariants: Variants =
    position === 'right'
      ? slideLeftVariants
      : {
          initial: { x: -300, opacity: 0 },
          animate: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
          },
          exit: { x: -300, opacity: 0, transition: { duration: 0.15 } },
        }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer Body */}
          <motion.div
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'bg-bg-primary border-l border-border-subtle h-full w-80 max-w-full p-sm relative shadow-2xl z-10 flex flex-col',
              position === 'left' && 'left-0 right-auto border-r border-l-0'
            )}
          >
            <header className="flex justify-between items-center mb-md border-b border-border-subtle pb-xs">
              <h3 className="font-semibold text-subtitle text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto text-[14px] text-text-muted leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/**
 * BottomSheet: Standard mobile slide-up sheet (Design Bible Section 16).
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Bottom Sheet Body */}
          <motion.div
            variants={slideUpVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-bg-primary border-t border-border-subtle rounded-t-symmetric w-full max-w-lg p-sm relative shadow-2xl z-10 pb-[calc(env(safe-area-inset-bottom)+16px)]"
          >
            {/* Grab Handle Bar */}
            <div className="w-12 h-1 bg-border-subtle rounded-pill mx-auto mb-sm" />

            <header className="flex justify-between items-center mb-xs">
              <h3 className="font-semibold text-subtitle text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </header>

            <div className="text-[14px] text-text-muted leading-relaxed mt-xxs max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  align?: 'left' | 'right'
}

/**
 * Dropdown component.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen,
  setIsOpen,
  align = 'right',
}) => {
  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click cover */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

            <motion.div
              variants={scaleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'absolute mt-xxs w-48 rounded-soft bg-bg-primary border border-border-subtle shadow-lg z-20 overflow-hidden py-xxs',
                align === 'right' ? 'right-0' : 'left-0'
              )}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

interface TooltipProps {
  content: string
  children: React.ReactNode
}

/**
 * Tooltip hover metadata helper.
 */
export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = React.useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-xxs px-xs py-[4px] bg-text-primary text-bg-primary text-[11px] font-medium rounded-soft shadow-md z-30 whitespace-nowrap pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
