import React from 'react'
import { cn } from '@/lib/utils'

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * Centered responsive Container wrapper.
 */
export const Container: React.FC<LayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('w-full max-w-6xl mx-auto px-md', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Vertical Section wrapper (adds vertical grid spacing).
 */
export const Section: React.FC<LayoutProps> = ({ children, className, ...props }) => {
  return (
    <section className={cn('py-md md:py-lg', className)} {...props}>
      {children}
    </section>
  )
}

interface GridProps extends LayoutProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
}

/**
 * Responsive Grid container.
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 'sm',
  className,
  ...props
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
  }

  const gapClasses = {
    xxs: 'gap-xxs',
    xs: 'gap-xs',
    sm: 'gap-sm',
    md: 'gap-md',
    lg: 'gap-lg',
  }

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)} {...props}>
      {children}
    </div>
  )
}

interface StackProps extends LayoutProps {
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'between' | 'around'
  gap?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'none'
}

/**
 * Flex layout Stack helper.
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'col',
  align = 'stretch',
  justify = 'start',
  gap = 'xs',
  className,
  ...props
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
  }

  const gapClasses = {
    xxs: 'gap-xxs',
    xs: 'gap-xs',
    sm: 'gap-sm',
    md: 'gap-md',
    lg: 'gap-lg',
    none: 'gap-0',
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Divider: Simple visual separation border.
 */
export const Divider: React.FC<LayoutProps> = ({ className, ...props }) => {
  return <hr className={cn('border-t border-border-subtle my-sm w-full', className)} {...props} />
}
