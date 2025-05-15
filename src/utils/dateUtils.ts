
import { format as dateFnsFormat, formatDistanceToNow } from 'date-fns';

// Helper to check if a date is valid
export const isValidDate = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Safe format function with error handling
export const format = (date: Date | string | number | null | undefined, formatStr: string): string => {
  try {
    if (!date) return 'N/A';
    
    // If it's a string, try to parse it first
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate the date
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateFnsFormat(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Error formatting date';
  }
};

// Format date relative to now (e.g., "2 days ago")
export const formatRelative = (dateString?: string | null): string => {
  try {
    if (!dateString || !isValidDate(dateString)) {
      return 'N/A';
    }
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

// Format date for display (e.g., "Jan 15, 2023") with fallback
export const formatDate = (dateString?: string | null, formatStr: string = 'MMM d, yyyy'): string => {
  if (!dateString || !isValidDate(dateString)) {
    return 'N/A';
  }
  
  return format(new Date(dateString), formatStr);
};
