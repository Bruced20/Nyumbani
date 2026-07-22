'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Home,
  Search,
  PenSquare,
  Plus,
  Heart,
  Building2,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  Map,
  User,
} from 'lucide-react'
import { Button } from '../button'
import { Drawer, Dropdown } from '../overlay'

type ThemeChoice = 'light' | 'dark' | 'system'

interface NavbarProps {
  className?: string
  isAuthenticated?: boolean
  userName?: string
  avatarUrl?: string
  onSignOut?: () => void
  onSignOpen?: () => void
  /** Stored preference; when provided alongside onSetTheme, an appearance control renders. */
  theme?: ThemeChoice
  onSetTheme?: (theme: ThemeChoice) => void
}

/**
 * Presentational Light / Dark / System control. Wiring lives in the app (navbar-wrapper).
 */
export const AppearanceControl: React.FC<{
  theme: ThemeChoice
  onSetTheme: (theme: ThemeChoice) => void
  className?: string
}> = ({ theme, onSetTheme, className }) => {
  const options: { value: ThemeChoice; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system', label: 'System', icon: <Laptop size={16} /> },
  ]
  return (
    <div
      className={cn(
        'flex items-center gap-xxs p-[4px] bg-bg-primary rounded-soft border border-border-subtle',
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSetTheme(opt.value)}
          aria-pressed={theme === opt.value}
          className={cn(
            'flex-1 flex items-center justify-center gap-xxs px-xs py-[8px] rounded-soft text-[13px] font-medium transition-colors cursor-pointer',
            theme === opt.value
              ? 'bg-bg-secondary text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/**
 * Main Application Navigation Header.
 * Refactored for Sprint D2: logo scale, link weights, and standard Button components.
 */
const MAIN_NAV_ITEMS = [
  { href: '/', label: 'Home', subtitle: 'Back to the homepage', icon: <Home size={20} /> },
  {
    href: '/search',
    label: 'Find Rentals',
    subtitle: 'Browse homes across Kenya',
    icon: <Search size={20} />,
  },
  {
    href: '/saved',
    label: 'Saved Homes',
    subtitle: 'Homes you’ve bookmarked',
    icon: <Heart size={20} />,
  },
  {
    href: '/review/new',
    label: 'Write a Review',
    subtitle: 'Share your tenant experience',
    icon: <PenSquare size={20} />,
  },
  {
    href: '/properties/new',
    label: 'Add a Property',
    subtitle: 'List a home for rent',
    icon: <Plus size={20} />,
  },
  {
    href: '/owners',
    label: 'Landlord Hub',
    subtitle: 'Tools for property owners',
    icon: <Building2 size={20} />,
  },
  {
    href: '/about',
    label: 'About',
    subtitle: 'How Nyumbani works',
    icon: <ChevronRight size={20} />,
  },
  {
    href: '/search',
    label: 'Map View',
    subtitle: 'See listings on the map',
    icon: <Map size={20} />,
  },
]

const QUICK_ACTIONS = [
  { href: '/search?recent=true', label: 'Recently Added' },
  { href: '/search?sort=health', label: 'Top Rated' },
  { href: '/search?verified=true', label: 'Verified' },
  { href: '/search?sort=rent-low', label: 'Cheap Rent' },
  { href: '/search?houseType=Bedsitter', label: 'Bedsitters' },
  { href: '/search?houseType=Studio', label: 'Studios' },
]

export const Navbar: React.FC<NavbarProps> = ({
  className,
  isAuthenticated = false,
  userName,
  avatarUrl,
  onSignOut,
  onSignOpen,
  theme,
  onSetTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

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
          className="font-semibold text-[20px] tracking-tight text-text-primary flex items-center gap-[14px]"
        >
          <Image
            src="/logo-mark.png"
            alt="Nyumbani logo"
            width={28}
            height={28}
            priority
            className="h-7 w-7 rounded-soft shadow-sm"
          />
          Nyumbani
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-sm lg:gap-lg text-[15px] font-medium text-text-muted">
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
            About
          </Link>
        </nav>

        {/* User Session CTA */}
        <div className="flex items-center gap-sm">
          <div className="hidden md:block">
            <Dropdown
              isOpen={isProfileMenuOpen}
              setIsOpen={setIsProfileMenuOpen}
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="h-9 w-9 rounded-pill bg-bg-secondary border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer overflow-hidden"
                >
                  {isAuthenticated ? (
                    avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={avatarUrl}
                        alt="user avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-[13px] text-brand-primary">
                        {userName?.[0]}
                      </span>
                    )
                  ) : (
                    <User size={18} />
                  )}
                </button>
              }
            >
              <div className="w-[240px] p-xs flex flex-col gap-xxs">
                {isAuthenticated && (
                  <div className="px-xs py-xxs text-[13px] font-medium text-text-primary truncate">
                    Hello, {userName}
                  </div>
                )}
                <Link
                  href="/"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-sm px-xs py-[10px] rounded-soft text-[14px] font-medium text-text-primary hover:bg-bg-primary transition-colors"
                >
                  <Home size={16} className="text-text-muted" />
                  Home
                </Link>
                <Link
                  href="/saved"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-sm px-xs py-[10px] rounded-soft text-[14px] font-medium text-text-primary hover:bg-bg-primary transition-colors"
                >
                  <Heart size={16} className="text-text-muted" />
                  Saved Homes
                </Link>
                <Link
                  href="/properties/new"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-sm px-xs py-[10px] rounded-soft text-[14px] font-medium text-text-primary hover:bg-bg-primary transition-colors"
                >
                  <Plus size={16} className="text-text-muted" />
                  Add a Property
                </Link>

                {theme && onSetTheme && (
                  <div className="pt-xxs">
                    <AppearanceControl theme={theme} onSetTheme={onSetTheme} />
                  </div>
                )}

                <div className="border-t border-border-subtle mt-xxs pt-xxs">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        onSignOut?.()
                      }}
                      className="w-full flex items-center gap-sm px-xs py-[10px] rounded-soft text-[14px] font-medium text-status-error hover:bg-bg-primary transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        onSignOpen?.()
                      }}
                      variant="primary"
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </Dropdown>
          </div>

          {/* Mobile Menu Icon */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden relative z-10 text-text-primary hover:text-text-muted cursor-pointer p-xxs"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer — full product nav: header, sectioned links
          with subtitles, quick-action filter chips, account, appearance, footer. */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        title="Menu"
        position="right"
        header={
          <header className="flex items-start justify-between mb-sm border-b border-border-subtle pb-sm">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-[14px]">
              <Image
                src="/logo-mark.png"
                alt="Nyumbani logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-soft shadow-sm"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-semibold text-[18px] tracking-tight text-text-primary">
                  Nyumbani
                </span>
                <span className="text-[12px] text-text-muted">Trusted Home Discovery</span>
              </span>
            </Link>
            <button
              onClick={closeMobileMenu}
              aria-label="Close"
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center -mr-xs -mt-xxs"
            >
              <X size={20} />
            </button>
          </header>
        }
      >
        <nav className="flex flex-col -mx-xs">
          {MAIN_NAV_ITEMS.map((item, idx) => (
            <Link
              key={`${item.href}-${idx}`}
              href={item.href}
              onClick={closeMobileMenu}
              className="flex items-center gap-sm px-xs min-h-[52px] py-xxs rounded-soft text-[15px] font-medium text-text-primary hover:bg-bg-primary active:bg-bg-primary transition-colors"
            >
              <span className="text-text-muted shrink-0">{item.icon}</span>
              <span className="flex flex-col leading-tight">
                {item.label}
                <span className="text-[12px] font-normal text-text-muted">{item.subtitle}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border-subtle mt-sm pt-sm">
          <p className="px-xs pb-xs text-[12px] font-semibold text-text-muted uppercase tracking-wide">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-xs px-xs">
            {QUICK_ACTIONS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                onClick={closeMobileMenu}
                className="px-sm py-xxs border border-border-subtle rounded-pill text-[13px] font-medium text-text-primary hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-border-subtle mt-sm pt-sm flex flex-col gap-xxs">
          {isAuthenticated ? (
            <>
              <Link
                href="/saved"
                onClick={closeMobileMenu}
                className="flex items-center gap-sm px-xs min-h-[52px] rounded-soft text-[15px] font-medium text-text-primary hover:bg-bg-primary transition-colors"
              >
                <Heart size={18} className="text-text-muted" />
                Saved Homes
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu()
                  onSignOut?.()
                }}
                className="flex items-center gap-sm px-xs min-h-[52px] rounded-soft text-[15px] font-medium text-status-error hover:bg-bg-primary transition-colors cursor-pointer"
              >
                <X size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <Button
              onClick={() => {
                closeMobileMenu()
                onSignOpen?.()
              }}
              variant="primary"
              className="w-full mt-xxs"
            >
              Continue with Google
            </Button>
          )}
        </div>

        {theme && onSetTheme && (
          <div className="border-t border-border-subtle mt-sm pt-sm">
            <p className="px-xs pb-xs text-[12px] font-semibold text-text-muted uppercase tracking-wide">
              Appearance
            </p>
            <div className="px-xs">
              <AppearanceControl theme={theme} onSetTheme={onSetTheme} />
            </div>
          </div>
        )}

        <div className="border-t border-border-subtle mt-sm pt-sm flex items-center justify-between">
          <Link
            href="/about"
            onClick={closeMobileMenu}
            className="px-xs py-xs text-[13px] font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            About Nyumbani
          </Link>
          <span className="px-xs py-xs text-[12px] text-text-muted">v1.0</span>
        </div>
      </Drawer>
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
        href="/"
        className={cn(
          'flex flex-col items-center justify-center gap-[4px] text-[11px] font-medium text-text-muted select-none w-16 h-full transition-colors',
          currentPath === '/' && 'text-brand-primary font-semibold'
        )}
      >
        <Home size={18} className={currentPath === '/' ? 'stroke-[2px]' : ''} />
        Home
      </Link>

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
          <Link href="/" className="flex items-center gap-xs">
            <Image
              src="/logo-mark.png"
              alt="Nyumbani logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-soft"
            />
            <span className="font-semibold text-[16px] text-text-primary tracking-tight">
              Nyumbani
            </span>
          </Link>
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
