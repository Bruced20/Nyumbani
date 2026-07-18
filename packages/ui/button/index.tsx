'use client'

import React from 'react'
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant
  isLoading?: boolean
  icon?: React.ReactNode
}

/**
 * Reusable Design System Button component.
 * Refactored for Sprint D2: reduced motion compatibility, uniform focus rings, and tactile tap spring scales.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant = 'primary', isLoading = false, icon, disabled, ...props },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()

    const variantClasses = {
      primary:
        'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm border border-transparent',
      secondary:
        'bg-bg-secondary text-text-primary border border-border-subtle hover:bg-border-subtle/40 shadow-sm',
      outline:
        'bg-transparent text-text-primary border border-border-subtle hover:bg-bg-secondary shadow-sm',
      ghost: 'bg-transparent text-text-primary hover:bg-bg-secondary border border-transparent',
      destructive:
        'bg-status-error text-white hover:bg-status-error/95 shadow-sm border border-transparent',
    }

    const hoverAnimation =
      disabled || isLoading || shouldReduceMotion ? undefined : { scale: 1.01, y: -0.5 }
    const tapAnimation =
      disabled || isLoading || shouldReduceMotion ? undefined : { scale: 0.98, y: 0 }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        className={cn(
          'inline-flex items-center justify-center gap-xs px-sm py-[10px] font-sans text-[14px] font-semibold rounded-soft cursor-pointer transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] md:min-h-[40px]',
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
