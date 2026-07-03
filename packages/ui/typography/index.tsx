import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: React.ElementType
}

/**
 * Display Typography: For massive homepage hero headers (72px desktop / 40px mobile).
 */
export const Display: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h1',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-[2.5rem] md:text-[4.5rem] leading-[1.1] font-bold tracking-tight text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H1 Typography: For primary page headers (40px desktop / 28px mobile).
 */
export const H1: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h1',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-[1.75rem] md:text-[2.5rem] leading-[1.2] font-bold tracking-tight text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H2 Typography: For cards and major section titles (24px).
 */
export const H2: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h2',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-[1.5rem] leading-[1.3] font-semibold tracking-tight text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H3 Typography: For smaller card subtitles and subheadings (20px).
 */
export const H3: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-[1.25rem] leading-[1.35] font-medium tracking-tight text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H4 Typography: For micro section headers and category items (16px).
 */
export const H4: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h4',
  ...props
}) => {
  return (
    <Component
      className={cn('text-[1rem] leading-[1.4] font-medium text-text-primary', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Body Typography: Standard text block copy (18px).
 */
export const Body: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component
      className={cn('text-[1.125rem] leading-[1.65] font-normal text-text-primary', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Small Typography: Muted descriptive captions and form descriptions (14px).
 */
export const Small: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component
      className={cn('text-[0.875rem] leading-[1.4] font-medium text-text-muted', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Caption Typography: Ultra-small labels and system stamps (12px).
 */
export const Caption: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-[0.75rem] leading-[1.3] font-medium tracking-wider uppercase text-text-muted',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
