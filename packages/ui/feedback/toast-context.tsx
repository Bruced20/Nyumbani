'use client'

import React, { createContext, useContext, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { ToastAccent } from './index'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

interface ToastItem {
  id: number
  message: string
  description?: string
  variant: ToastVariant
  duration: number
}

type FireArgs = string | { message: string; description?: string; duration?: number }

interface ToastApi {
  info: (args: FireArgs) => void
  success: (args: FireArgs) => void
  warning: (args: FireArgs) => void
  error: (args: FireArgs) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | undefined>(undefined)

function normalize(args: FireArgs): { message: string; description?: string; duration?: number } {
  return typeof args === 'string' ? { message: args } : args
}

/**
 * Toast delivery system.
 * Holds a queue of toasts and renders a stacked, bottom-right viewport.
 * Any client component can fire one via useToast(): toast.success('Saved').
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((variant: ToastVariant, args: FireArgs) => {
    const { message, description, duration = 4000 } = normalize(args)
    const id = nextId.current++
    setToasts((prev) => [...prev, { id, message, description, variant, duration }])
  }, [])

  const api: ToastApi = React.useMemo(
    () => ({
      info: (a) => push('info', a),
      success: (a) => push('success', a),
      warning: (a) => push('warning', a),
      error: (a) => push('error', a),
      dismiss,
    }),
    [push, dismiss]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

const ToastViewport: React.FC<{ toasts: ToastItem[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="fixed bottom-sm right-sm z-[60] flex flex-col gap-xs w-full max-w-[24rem] px-sm sm:px-0 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastRow
            key={t.id}
            toast={t}
            reduceMotion={!!shouldReduceMotion}
            onDismiss={() => onDismiss(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

const ToastRow: React.FC<{
  toast: ToastItem
  reduceMotion: boolean
  onDismiss: () => void
}> = ({ toast, reduceMotion, onDismiss }) => {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto flex gap-xs p-sm bg-bg-secondary text-text-primary rounded-symmetric shadow-lg border border-border-subtle"
    >
      <ToastAccent variant={toast.variant} />
      <div className="flex-1 flex flex-col gap-xxs">
        <span className="font-semibold text-[14px] leading-snug">{toast.message}</span>
        {toast.description && (
          <span className="text-[12px] text-text-muted leading-relaxed">{toast.description}</span>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-text-muted hover:text-text-primary transition-colors self-start cursor-pointer min-w-[24px] min-h-[24px] flex items-center justify-center"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
