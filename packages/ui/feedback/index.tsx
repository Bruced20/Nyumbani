'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { scaleVariants } from '../animations'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

/**
 * Standard Alert banner component with matching semantic color tokens.
 */
export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', className }) => {
  const styles = {
    info: 'bg-bg-secondary text-text-primary border-border-subtle',
    success: 'bg-accent-emerald/5 text-accent-emerald border-accent-emerald/20',
    warning: 'bg-accent-amber/5 text-accent-amber border-accent-amber/20',
    error: 'bg-accent-coral/5 text-accent-coral border-accent-coral/20',
  }

  const icons = {
    info: <Info size={18} className="shrink-0" />,
    success: <CheckCircle2 size={18} className="shrink-0" />,
    warning: <AlertCircle size={18} className="shrink-0" />,
    error: <AlertCircle size={18} className="shrink-0" />,
  }

  return (
    <div
      className={cn(
        'flex gap-xs p-sm border rounded-soft text-[14px] leading-relaxed',
        styles[variant],
        className
      )}
    >
      {icons[variant]}
      <div className="flex-1">{children}</div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onActionClick?: () => void
  icon?: React.ReactNode
}

/**
 * Clean EmptyState component mapping UX Blueprint section 6.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-lg border border-dashed border-border-subtle rounded-symmetric bg-bg-secondary max-w-md mx-auto">
      {icon && <div className="mb-sm text-text-muted">{icon}</div>}
      <h3 className="font-semibold text-subtitle mb-xxs text-text-primary">{title}</h3>
      <p className="text-[14px] text-text-muted mb-sm max-w-xs">{description}</p>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-sm py-xxs bg-brand-indigo text-white font-medium rounded-soft text-[13px] hover:bg-opacity-95 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

/**
 * Standard ErrorState block mapping validation/network error recoveries.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-sm border border-accent-coral/20 rounded-symmetric bg-accent-coral/5 max-w-sm mx-auto">
      <AlertCircle className="text-accent-coral mb-xxs" size={24} />
      <h4 className="font-semibold text-[14px] text-accent-coral mb-xxs">System Exception</h4>
      <p className="text-[13px] text-text-muted mb-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-xs py-[4px] bg-accent-coral text-white font-medium rounded-soft text-[12px] hover:bg-opacity-95 transition-all cursor-pointer"
        >
          Retry Request
        </button>
      )}
    </div>
  )
}

/**
 * Atomic LoadingSpinner component.
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const dimensions = {
    sm: 'h-4 w-4 stroke-[3]',
    md: 'h-8 w-8 stroke-[2]',
    lg: 'h-12 w-12 stroke-[1.5]',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin text-brand-indigo', dimensions[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-10"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

/**
 * Skeleton Loader Component with pulsing glow.
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-soft', className)}
    />
  )
}

interface ToastProps {
  message: string
  description?: string
  isOpen: boolean
  onClose: () => void
  duration?: number
}

/**
 * Standard Toast pop-up component using AnimatePresence.
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  description,
  isOpen,
  onClose,
  duration = 3000,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={scaleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-sm right-sm z-50 flex max-w-sm gap-xs p-sm bg-text-primary text-bg-primary rounded-symmetric shadow-lg border border-border-subtle"
        >
          <div className="flex-1 flex flex-col gap-xxs">
            <span className="font-semibold text-[14px]">{message}</span>
            {description && <span className="text-[12px] opacity-80">{description}</span>}
          </div>
          <button
            onClick={onClose}
            className="text-bg-primary hover:opacity-85 transition-opacity self-start cursor-pointer"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
