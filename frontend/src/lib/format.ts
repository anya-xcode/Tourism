import type { IPlace } from '../types';
import { getOptimizedUrl } from '../utils/cloudinaryUtils';

/** "45 min", "2 h", "2 h 30 min" */
export function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

const BUDGET_MARKS: Record<string, string> = {
  Free: 'Free',
  Budget: '₹',
  Moderate: '₹₹',
  Premium: '₹₹₹',
};

/** Budget band as rupee marks: Free, ₹, ₹₹, ₹₹₹ */
export function budgetMarks(budget?: string): string {
  return (budget && BUDGET_MARKS[budget]) || '—';
}

export function hasRating(place: Pick<IPlace, 'totalReviews' | 'averageRating'>): boolean {
  return (place.totalReviews ?? 0) > 0 && (place.averageRating ?? 0) > 0;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Resolve a stored photo path to a usable URL (Cloudinary-optimised when possible). */
export function photoUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes('cloudinary.com')) return getOptimizedUrl(url);
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${base}/${url.replace(/^\//, '')}`;
}

/** Ask Unsplash for a smaller rendition when we know the display width. */
export function sizedPhoto(url: string | undefined, width: number): string | undefined {
  const resolved = photoUrl(url);
  if (!resolved) return undefined;
  if (resolved.includes('images.unsplash.com')) {
    return resolved.replace(/([?&])w=\d+/, `$1w=${width}`);
  }
  return resolved;
}

/** Strip stray markdown characters some places were saved with. */
export function plainText(text?: string): string {
  return (text || '').replace(/[#*`_~]/g, '').trim();
}

export function formatDate(value?: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', opts);
}

export function googleMapsUrl(place: Pick<IPlace, 'location' | 'name'>, directions = false): string | undefined {
  const [lng, lat] = place.location?.coordinates || [];
  if (lat === undefined || lng === undefined) return undefined;
  return directions
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Pull a readable message out of an axios error. */
export function errorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const anyErr = err as { response?: { data?: { message?: string } }; message?: string; code?: string };
    if (anyErr.response?.data?.message) return anyErr.response.data.message;
    if (anyErr.code === 'ERR_NETWORK') return "Can't reach the server. Check that the backend is running, then try again.";
  }
  return fallback;
}
