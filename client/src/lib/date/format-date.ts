import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date into 'PPpp' (e.g. "Jun 13, 2025 at 4:30 PM")
 * @param input - A Date object or ISO string
 * @returns Formatted string or fallback
 */
export const formatDatePPpp = (input: Date | string | undefined | null): string => {
  if (!input) return 'Invalid date';

  const date = typeof input === 'string' ? parseISO(input) : input;

  return isValid(date) ? format(date, 'PPpp') : 'Invalid date';
};
