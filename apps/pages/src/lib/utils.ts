import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency for Peru (PEN)
 */
export function formatCurrency(amount: number, currency: string = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for Peru timezone
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'long') {
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(d);
  }

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
  }).format(d);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate Peruvian phone number
 */
export function isValidPeruvianPhone(phone: string): boolean {
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s()-]/g, '');

  // Check if it matches Peruvian formats:
  // - Mobile: 9XXXXXXXX (9 digits starting with 9)
  // - Landline: 01XXXXXXX (9 digits starting with 01)
  // - International: +519XXXXXXXX or 00519XXXXXXXX
  const patterns = [
    /^9\d{8}$/, // Mobile
    /^01\d{7}$/, // Lima landline
    /^0\d{2}\d{6}$/, // Other landlines
    /^\+519\d{8}$/, // International mobile
    /^00519\d{8}$/, // International mobile (alternative)
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
