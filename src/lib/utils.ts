import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges CSS classes safely using clsx and tailwind-merge.
 * Solves class override conflicts in Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Standard currency formatter for Kenya Shillings (KES).
 */
export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Utility to generate descriptive date tags for reviews.
 */
export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
  }).format(date)
}
