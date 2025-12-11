/**
 * Date utility functions
 * Following rule: Reusable utilities, no code duplication
 */

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Get the date threshold for inactivity check
 * Returns a date that is N days ago from now
 * Default: 365 days (1 year)
 */
export function getInactivityThreshold(days: number = 365): Date {
  return subtractDays(new Date(), days);
}

/**
 * Get date N days ago
 */
export function getDaysAgo(days: number): Date {
  return subtractDays(new Date(), days);
}

/**
 * Get date N days from now
 */
export function getDaysFromNow(days: number): Date {
  return addDays(new Date(), days);
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Format date to ISO string
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

