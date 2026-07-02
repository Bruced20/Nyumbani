'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

/**
 * Custom Checkbox component.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-xxs">
        <label className="inline-flex items-center gap-xs cursor-pointer select-none">
          <input
            ref={ref}
            type="checkbox"
            className={cn('peer sr-only focus:outline-none', className)}
            {...props}
          />
          {/* Custom Checkbox Node */}
          <div className="h-5 w-5 border border-border-subtle rounded-soft bg-bg-secondary flex items-center justify-center transition-all duration-200 peer-checked:bg-brand-indigo peer-checked:border-brand-indigo peer-focus-visible:ring-2 peer-focus-visible:ring-brand-indigo/20">
            <svg
              className="h-3 w-3 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {label && <span className="text-[14px] text-text-primary">{label}</span>}
        </label>
        {error && <span className="text-[12px] font-medium text-accent-coral">{error}</span>}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

/**
 * Custom Radio button component.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-xs cursor-pointer select-none">
        <input ref={ref} type="radio" className={cn('peer sr-only', className)} {...props} />
        {/* Custom Radio Node */}
        <div className="h-5 w-5 border border-border-subtle rounded-pill bg-bg-secondary flex items-center justify-center transition-all duration-200 peer-checked:border-brand-indigo peer-checked:bg-brand-indigo/10 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-indigo/20">
          <div className="h-2 w-2 rounded-pill bg-brand-indigo opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
        </div>
        {label && <span className="text-[14px] text-text-primary">{label}</span>}
      </label>
    )
  }
)
Radio.displayName = 'Radio'

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/**
 * Custom sliding Switch component using Framer Motion layout animation.
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  className,
  disabled,
  ...props
}) => {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-xs cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onCheckedChange(e.target.checked)}
        className="sr-only peer"
        disabled={disabled}
        {...props}
      />
      {/* Switch Track */}
      <div
        className={cn(
          'w-11 h-6 bg-border-subtle rounded-pill transition-colors duration-200 relative flex items-center p-[2px]',
          checked && 'bg-brand-indigo'
        )}
      >
        {/* Sliding thumb */}
        <motion.div
          layout
          className="w-5 h-5 bg-white rounded-pill shadow-sm"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          animate={{ x: checked ? 20 : 0 }}
        />
      </div>
      {label && <span className="text-[14px] text-text-primary">{label}</span>}
    </label>
  )
}

interface ToggleProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

/**
 * Toggle component (acting as selected state button indicator).
 */
export const Toggle: React.FC<ToggleProps> = ({
  pressed,
  onPressedChange,
  children,
  className,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onPressedChange(!pressed)}
      disabled={disabled}
      className={cn(
        'px-sm py-xxs border border-border-subtle rounded-pill text-[13px] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
        pressed
          ? 'bg-brand-indigo text-white border-brand-indigo'
          : 'bg-bg-secondary text-text-primary hover:bg-neutral-100',
        className
      )}
    >
      {children}
    </button>
  )
}
