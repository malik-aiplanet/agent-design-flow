import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Formats a datetime string to a relative time string (e.g., "2 hours ago")
 *
 * @param dateString - The ISO date string to format
 * @returns Formatted relative time string or "Unknown" if date is invalid
 *
 * @example
 * formatRelativeTime("2024-01-15T10:30:00Z") // "2 hours ago"
 * formatRelativeTime("invalid-date") // "Unknown"
 */
export const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) {
    return "Unknown";
  }

  try {
    // Parse the ISO string to a Date object
    const date = parseISO(dateString);

    // Check if the parsed date is valid
    if (!isValid(date)) {
      console.warn('Invalid date provided:', dateString);
      return "Unknown";
    }

    // Format as relative time with "ago" suffix
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });

    // Capitalize first letter for consistency
    return relativeTime

  } catch (error) {
    console.warn('Failed to parse date:', dateString, error);
    return "Unknown";
  }
};
