'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Standard TextInput component with inline validation errors and focus states.
 * Refactored for Sprint D2: standardized focus rings, validation styles, and placeholder styling.
 */
export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[6px] w-full">
        {label && (
          <label className="text-[14px] font-medium text-text-primary select-none">{label}</label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-sm py-[11px] bg-bg-secondary text-text-primary border border-border-subtle rounded-soft text-[15px] outline-none transition-all duration-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 placeholder:text-text-muted/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[44px]',
            error && 'border-status-error focus:border-status-error focus:ring-status-error/5',
            className
          )}
          {...props}
        />
        {error && <span className="text-[13px] font-medium text-status-error">{error}</span>}
        {!error && helperText && <span className="text-[13px] text-text-muted">{helperText}</span>}
      </div>
    )
  }
)
TextInput.displayName = 'TextInput'

/**
 * SearchInput: Text input containing a prefix Lucide Search icon.
 * Spotlight-style query inputs.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <span className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          <Search size={20} strokeWidth={2} className="text-text-muted/85" />
        </span>
        <input
          ref={ref}
          type="text"
          className={cn(
            'w-full pl-[46px] pr-sm py-[14px] bg-bg-secondary text-text-primary border border-border-subtle rounded-soft text-[16px] font-medium outline-none transition-all duration-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 placeholder:text-text-muted/50 shadow-md min-h-[48px]',
            error && 'border-status-error focus:border-status-error',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

/**
 * NumberInput: Restricts keypress events to numeric digits only.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault()
      }
    }

    return (
      <TextInput
        ref={ref}
        type="text"
        inputMode="numeric"
        onKeyPress={handleKeyPress}
        className={className}
        {...props}
      />
    )
  }
)
NumberInput.displayName = 'NumberInput'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Textarea component for multiline inputs (e.g. review text context).
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, rows = 4, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[6px] w-full">
        {label && (
          <label className="text-[14px] font-medium text-text-primary select-none">{label}</label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-sm py-[11px] bg-bg-secondary text-text-primary border border-border-subtle rounded-soft text-[15px] outline-none transition-all duration-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 placeholder:text-text-muted/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm resize-none min-h-[80px]',
            error && 'border-status-error focus:border-status-error focus:ring-status-error/5',
            className
          )}
          {...props}
        />
        {error && <span className="text-[13px] font-medium text-status-error">{error}</span>}
        {!error && helperText && <span className="text-[13px] text-text-muted">{helperText}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
