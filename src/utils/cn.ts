import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with commas */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

/** Format km distance */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${formatNumber(Math.round(km))} km`;
}

/** Format delay in minutes */
export function formatDelay(minutes: number): string {
  if (minutes === 0) return "On Time";
  const sign = minutes > 0 ? "+" : "";
  if (Math.abs(minutes) < 60) return `${sign}${minutes} min`;
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  return `${sign}${h}h ${m}m`;
}

/** Format a timestamp as relative time ("18 seconds ago") */
export function formatRelativeTime(timestamp: string): string {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/** Format HH:MM time from ISO string */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Returns true if the timestamp is stale (older than thresholdMs) */
export function isStale(timestamp: string, thresholdMs = 3 * 60 * 1000): boolean {
  return Date.now() - new Date(timestamp).getTime() > thresholdMs;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}
