'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Search, PenSquare, Building2, ChevronRight, Menu, Sun, Moon } from 'lucide-react'
import { Button } from '../button'

interface NavbarProps {
  className?: string
  isAuthenticated?: boolean
  userName?: string
  avatarUrl?: string
  onSignOut?: () => void
  onSignOpen?: () => void
  /** Currently applied theme; when provided, a theme toggle renders. */
  resolvedTheme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

/**
 * Presentational theme toggle. Wiring lives in the app (navbar-wrapper).
 */
export const ThemeToggle: React.FC<{
  resolvedTheme: 'light' | 'dark'
  onToggle: () => void
  className?: string
}> = ({ resolvedTheme, onToggle, className }) => {
  const isDark = resolvedTheme === 'dark'
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'h-9 w-9 rounded-pill flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-secondary border border-transparent hover:border-border-subtle transition-colors cursor-pointer',
        className
      )}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

/**
 * Main Application Navigation Header.
 * Refactored for Sprint D2: logo scale, link weights, and standard Button components.
 */
export const Navbar: React.FC<NavbarProps> = ({
  className,
  isAuthenticated = false,
  userName,
  avatarUrl,
  onSignOut,
  onSignOpen,
  resolvedTheme,
  onToggleTheme,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-bg-primary/80 border-b border-border-subtle backdrop-blur-md transition-all duration-300',
        className
      )}
    >
      <div className="max-w-6xl mx-auto h-[72px] px-md flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-semibold text-[20px] tracking-tight text-text-primary flex items-center gap-xs"
        >
          <span className="h-7 w-7 rounded-soft bg-brand-primary flex items-center justify-center text-white text-[13px] font-semibold shadow-sm">
            N
          </span>
          Nyumbani
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-lg text-[15px] font-medium text-text-muted">
          <Link href="/search" className="hover:text-text-primary transition-colors py-xxs">
            Find Rentals
          </Link>
          <Link href="/review/new" className="hover:text-text-primary transition-colors py-xxs">
            Write a Review
          </Link>
          <Link href="/owners" className="hover:text-text-primary transition-colors py-xxs">
            Landlord Hub
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors py-xxs">
            Our Method
          </Link>
        </nav>

        {/* User Session CTA */}
        <div className="flex items-center gap-sm">
          {resolvedTheme && onToggleTheme && (
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={onToggleTheme} />
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-sm">
              <span className="hidden sm:inline-block text-[14px] text-text-muted font-medium">
                Hello, {userName}
              </span>
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt="user avatar"
                  className="h-9 w-9 rounded-pill object-cover border border-border-subtle"
                />
              ) : (
                <div className="h-9 w-9 rounded-pill bg-bg-secondary border border-border-subtle flex items-center justify-center font-semibold text-[13px] text-brand-primary">
                  {userName?.[0]}
                </div>
              )}
              <button
                onClick={onSignOut}
                className="text-[14px] font-medium text-text-muted hover:text-text-primary cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Button
              onClick={onSignOpen}
              variant="primary"
              className="h-9 px-sm text-[14px] font-semibold rounded-soft py-[8px]"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-text-primary hover:text-text-muted cursor-pointer p-xxs">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}

interface MobileBottomNavProps {
  currentPath?: string
}

/**
 * MobileBottomNav: Bottom sticky navigation tabs for Mobile-first usage.
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/95 border-t border-border-subtle h-[64px] flex items-center justify-around pb-safe backdrop-blur-md">
      <Link
        href="/search"
        className={cn(
          'flex flex-col items-center justify-center gap-[4px] text-[11px] font-medium text-text-muted select-none w-16 h-full transition-colors',
          currentPath === '/search' && 'text-brand-primary font-semibold'
        )}
      >
        <Search size={18} className={currentPath === '/search' ? 'stroke-[2px]' : ''} />
        Search
      </Link>

      <Link
        href="/review/new"
        className={cn(
          'flex flex-col items-center justify-center gap-[4px] text-[11px] font-medium text-text-muted select-none w-16 h-full transition-colors',
          currentPath === '/review/new' && 'text-brand-primary font-semibold'
        )}
      >
        <PenSquare size={18} className={currentPath === '/review/new' ? 'stroke-[2px]' : ''} />
        Review
      </Link>

      <Link
        href="/owners"
        className={cn(
          'flex flex-col items-center justify-center gap-[4px] text-[11px] font-medium text-text-muted select-none w-16 h-full transition-colors',
          currentPath?.startsWith('/owners') && 'text-brand-primary font-semibold'
        )}
      >
        <Building2 size={18} className={currentPath?.startsWith('/owners') ? 'stroke-[2px]' : ''} />
        Owner Hub
      </Link>
    </nav>
  )
}

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

/**
 * Breadcrumb Component.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-[8px] text-[14px] text-text-muted font-medium py-xs overflow-x-auto whitespace-nowrap">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <React.Fragment key={idx}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-text-primary font-semibold' : ''}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className="shrink-0 text-text-muted/60" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Pagination Controls.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-sm mt-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-sm py-xs border border-border-subtle rounded-soft text-[14px] font-semibold text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer transition-colors"
      >
        Previous
      </button>

      <span className="text-[14px] font-semibold text-text-muted select-none px-xs">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-sm py-xs border border-border-subtle rounded-soft text-[14px] font-semibold text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer transition-colors"
      >
        Next
      </button>
    </div>
  )
}

/**
 * Shared layout Footer component.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bg-secondary border-t border-border-subtle py-xl mt-auto">
      <div className="max-w-6xl mx-auto px-md grid grid-cols-1 md:grid-cols-4 gap-lg text-text-muted text-[14px]">
        <div className="flex flex-col gap-sm pr-md">
          <span className="font-semibold text-[16px] text-text-primary tracking-tight">
            Nyumbani
          </span>
          <p className="leading-relaxed">
            Kenya&apos;s rental intelligence platform, bringing trust and transparency to home
            hunting.
          </p>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="font-semibold text-text-primary mb-xxs">Platform</span>
          <Link href="/search" className="hover:text-text-primary transition-colors py-[2px]">
            Search Listings
          </Link>
          <Link href="/review/new" className="hover:text-text-primary transition-colors py-[2px]">
            Write a Review
          </Link>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="font-semibold text-text-primary mb-xxs">Landlords</span>
          <Link href="/owners" className="hover:text-text-primary transition-colors py-[2px]">
            Owner Portal
          </Link>
          <Link
            href="/owners/dashboard"
            className="hover:text-text-primary transition-colors py-[2px]"
          >
            Verification Claims
          </Link>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="font-semibold text-text-primary mb-xxs">Legal & Safety</span>
          <Link href="/about" className="hover:text-text-primary transition-colors py-[2px]">
            Scoring Methodology
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors py-[2px]">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-md border-t border-border-subtle pt-md mt-lg flex justify-between items-center text-[13px] text-text-muted flex-wrap gap-sm">
        <span>© {new Date().getFullYear()} Nyumbani Rental Intelligence. All rights reserved.</span>
        <span className="font-medium">Made for Kenya 🇰🇪</span>
      </div>
    </footer>
  )
}
