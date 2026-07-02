'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant
  isLoading?: boolean
  icon?: React.ReactNode
}

/**
 * Reusable Design System Button component.
 * Leverages Framer Motion for micro-interactions (scale-down on click, spring hover transition).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant = 'primary', isLoading = false, icon, disabled, ...props },
    ref
  ) => {
    // Determine variant CSS tokens (conforming to Design Bible Section 25)
    const variantClasses = {
      primary: 'bg-brand-indigo text-white hover:bg-opacity-95 shadow-sm border border-transparent',
      secondary:
        'bg-bg-secondary text-text-primary border border-border-subtle hover:bg-neutral-100',
      outline: 'bg-transparent text-text-primary border border-border-subtle hover:bg-bg-secondary',
      ghost: 'bg-transparent text-text-primary hover:bg-bg-secondary border border-transparent',
      destructive:
        'bg-accent-coral text-white hover:bg-opacity-95 shadow-sm border border-transparent',
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? undefined : { scale: 1.01 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={cn(
          'inline-flex items-center justify-center gap-xs px-sm py-xxs font-sans text-[14px] font-medium rounded-soft cursor-pointer transition-colors duration-200 select-none outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
