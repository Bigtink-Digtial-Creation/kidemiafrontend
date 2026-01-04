import type { TableRowI } from "../staticData";

export const statusTheme: Record<
  TableRowI["status"],
  "success" | "warning" | "danger"
> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

export const getNameIntials = (name: string) => {
  if (!name) return null;

  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2);
  } else {
    return nameParts
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2);
  }
};

export const hexToRgba = (hex: string, alpha = 0.15) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}m : ${s
    .toString()
    .padStart(2, "0")}s`;
};

export const formatTimeSystem = (seconds: number) => {
  if (!seconds) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};


export const formatDateTime = (
  isoString: string,
  format: 'full' | 'date' | 'time' | 'relative' | 'short' = 'full'
): string => {
  const date = new Date(isoString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case 'full':
      // e.g., "December 20, 2025 at 10:30 AM"
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'short':
      // e.g., "12/20/25, 10:30 AM"
      return date.toLocaleString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
      });

    case 'date':
      // e.g., "December 20, 2025"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'time':
      // e.g., "10:30 AM"
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'relative':
      // e.g., "2 hours ago", "in 3 days"
      return getRelativeTime(date);

    default:
      return date.toLocaleString();
  }
};

/**
 * Gets relative time string (e.g., "2 hours ago", "in 3 days")
 */
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else if (Math.abs(diffDay) < 30) {
    return rtf.format(diffDay, 'day');
  } else if (Math.abs(diffDay) < 365) {
    return rtf.format(Math.round(diffDay / 30), 'month');
  } else {
    return rtf.format(Math.round(diffDay / 365), 'year');
  }
};


export const useFormattedDateTime = (
  isoString: string,
  format: 'full' | 'date' | 'time' | 'relative' | 'short' = 'full'
): string => {
  return formatDateTime(isoString, format);
};


export const formatBalance = (balance: number | string | undefined): string => {
  if (!balance) return '0';

  const num = typeof balance === 'string' ? parseFloat(balance) : balance;

  if (isNaN(num)) return '0';

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }

  return num.toLocaleString();
};