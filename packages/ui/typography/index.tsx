import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: React.ElementType
}

/**
 * Display Typography: Hero headline only (34px mobile / 44px desktop).
 * Sans, tight and confident — hierarchy from weight + spacing, not size.
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
        'text-[2.125rem] md:text-[2.75rem] leading-[1.1] font-bold tracking-tight text-text-primary text-balance',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H1 Typography: Primary page headers (26px mobile / 30px desktop).
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
        'text-[1.625rem] md:text-[1.875rem] leading-[1.2] font-semibold tracking-tight text-text-primary text-balance',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H2 Typography: Section titles (22px). Semibold, calm — stops shouting.
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
        'text-[1.375rem] leading-[1.3] font-semibold tracking-tight text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H3 Typography: Card subtitles and subheadings (18px).
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
        'text-[1.125rem] leading-[1.35] font-semibold tracking-tight text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * H4 Typography: Micro section headers and category items (16px).
 */
export const H4: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h4',
  ...props
}) => {
  return (
    <Component
      className={cn('text-[1rem] leading-[1.4] font-semibold text-text-primary', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Body Typography: Standard text block copy (16px).
 */
export const Body: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component
      className={cn('text-[1rem] leading-[1.6] font-normal text-text-primary/95', className)}
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
      className={cn('text-[0.875rem] leading-[1.4] font-normal text-text-muted/90', className)}
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
      className={cn('text-[0.75rem] leading-[1.3] font-medium text-text-muted/80', className)}
      {...props}
    >
      {children}
    </Component>
  )
}
