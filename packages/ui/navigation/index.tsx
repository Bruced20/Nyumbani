'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Search, PenSquare, Building2, ChevronRight, Menu } from 'lucide-react'

interface NavbarProps {
  className?: string
  isAuthenticated?: boolean
  userName?: string
  avatarUrl?: string
  onSignOut?: () => void
  onSignOpen?: () => void
}

/**
 * Main Application Navigation Header.
 */
export const Navbar: React.FC<NavbarProps> = ({
  className,
  isAuthenticated = false,
  userName,
  avatarUrl,
  onSignOut,
  onSignOpen,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-bg-primary border-b border-border-subtle backdrop-blur-md bg-opacity-95',
        className
      )}
    >
      <div className="max-w-6xl mx-auto h-[64px] px-md flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-bold text-[18px] tracking-tight text-text-primary flex items-center gap-xxs"
        >
          <span className="h-6 w-6 rounded-soft bg-brand-indigo flex items-center justify-center text-white text-[12px]">
            N
          </span>
          Nyumbani
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-md text-[14px] font-medium text-text-muted">
          <Link href="/search" className="hover:text-text-primary transition-colors">
            Find Rentals
          </Link>
          <Link href="/review/new" className="hover:text-text-primary transition-colors">
            Write a Review
          </Link>
          <Link href="/owners" className="hover:text-text-primary transition-colors">
            Landlord Hub
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            Our Method
          </Link>
        </nav>

        {/* User Session CTA */}
        <div className="flex items-center gap-xs">
          {isAuthenticated ? (
            <div className="flex items-center gap-xs">
              <span className="hidden sm:inline-block text-[13px] text-text-muted">
                Hello, {userName}
              </span>
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt="user avatar"
                  className="h-8 w-8 rounded-pill object-cover border border-border-subtle"
                />
              ) : (
                <div className="h-8 w-8 rounded-pill bg-border-subtle flex items-center justify-center font-bold text-[12px]">
                  {userName?.[0]}
                </div>
              )}
              <button
                onClick={onSignOut}
                className="text-[13px] font-medium text-text-muted hover:text-text-primary cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignOpen}
              className="px-sm py-xxs bg-text-primary text-bg-primary text-[13px] font-medium rounded-soft hover:bg-opacity-90 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-text-primary hover:text-text-muted cursor-pointer">
            <Menu size={20} />
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
 * MobileBottomNav: Bottom sticky navigation tabs for Mobile-first usage (Design Bible Section 15).
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t border-border-subtle h-[60px] flex items-center justify-around pb-safe">
      <Link
        href="/search"
        className={cn(
          'flex flex-col items-center justify-center gap-[3px] text-[10px] font-medium text-text-muted select-none w-16 h-full',
          currentPath === '/search' && 'text-brand-indigo font-semibold'
        )}
      >
        <Search size={18} />
        Search
      </Link>

      <Link
        href="/review/new"
        className={cn(
          'flex flex-col items-center justify-center gap-[3px] text-[10px] font-medium text-text-muted select-none w-16 h-full',
          currentPath === '/review/new' && 'text-brand-indigo font-semibold'
        )}
      >
        <PenSquare size={18} />
        Review
      </Link>

      <Link
        href="/owners"
        className={cn(
          'flex flex-col items-center justify-center gap-[3px] text-[10px] font-medium text-text-muted select-none w-16 h-full',
          currentPath?.startsWith('/owners') && 'text-brand-indigo font-semibold'
        )}
      >
        <Building2 size={18} />
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
    <nav className="flex items-center gap-[6px] text-[13px] text-text-muted font-medium py-xxs overflow-x-auto whitespace-nowrap">
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
            {!isLast && <ChevronRight size={14} className="shrink-0" />}
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
    <div className="flex items-center justify-center gap-xs mt-md">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-xs py-xxs border border-border-subtle rounded-soft text-[13px] font-medium text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
      >
        Previous
      </button>

      <span className="text-[13px] font-semibold text-text-muted select-none">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-xs py-xxs border border-border-subtle rounded-soft text-[13px] font-medium text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
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
    <footer className="w-full bg-bg-secondary border-t border-border-subtle py-lg mt-auto">
      <div className="max-w-6xl mx-auto px-md grid grid-cols-1 md:grid-cols-4 gap-md text-text-muted text-[13px]">
        <div className="flex flex-col gap-xxs">
          <span className="font-bold text-[15px] text-text-primary mb-xxs">Nyumbani</span>
          <p className="leading-relaxed">
            Kenya&apos;s rental intelligence platform, bringing trust and transparency to home
            hunting.
          </p>
        </div>
        <div className="flex flex-col gap-xxs">
          <span className="font-semibold text-text-primary mb-xxs">Platform</span>
          <Link href="/search" className="hover:text-text-primary transition-colors">
            Search Listings
          </Link>
          <Link href="/review/new" className="hover:text-text-primary transition-colors">
            Write a Review
          </Link>
        </div>
        <div className="flex flex-col gap-xxs">
          <span className="font-semibold text-text-primary mb-xxs">Landlords</span>
          <Link href="/owners" className="hover:text-text-primary transition-colors">
            Owner Portal
          </Link>
          <Link href="/owners/dashboard" className="hover:text-text-primary transition-colors">
            Verification Claims
          </Link>
        </div>
        <div className="flex flex-col gap-xxs">
          <span className="font-semibold text-text-primary mb-xxs">Legal & Safety</span>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            Scoring Methodology
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-md border-t border-border-subtle pt-sm mt-md flex justify-between items-center text-[12px] text-text-muted flex-wrap gap-xs">
        <span>© {new Date().getFullYear()} Nyumbani Rental Intelligence. All rights reserved.</span>
        <span>Made for Kenya 🇰🇪</span>
      </div>
    </footer>
  )
}
