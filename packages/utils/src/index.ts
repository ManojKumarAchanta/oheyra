import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { isSameDay, addDays, getDay } from 'date-fns';
import type { Coordinates } from '@pulse/contracts';

export const HYDERABAD_TIMEZONE = 'Asia/Kolkata';

/**
 * Calculates Haversine distance in kilometers between two points.
 */
export function haversineDistanceKm(p1: Coordinates, p2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Parses bounding box query param "minLng,minLat,maxLng,maxLat"
 */
export function parseBoundingBox(bboxStr: string): {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
} | null {
  const parts = bboxStr.split(',').map((p) => parseFloat(p.trim()));
  if (parts.length !== 4 || parts.some((p) => isNaN(p))) return null;
  return {
    minLng: parts[0],
    minLat: parts[1],
    maxLng: parts[2],
    maxLat: parts[3],
  };
}

/**
 * Formats ISO timestamp to human friendly IST string.
 */
export function formatToIST(isoDate: string, formatPattern: string = 'EEE, d MMM • h:mm a'): string {
  try {
    return formatInTimeZone(new Date(isoDate), HYDERABAD_TIMEZONE, formatPattern);
  } catch {
    return isoDate;
  }
}

/**
 * Checks if event falls within "Right Now" (active or starting in next 3 hours)
 */
export function isHappeningNow(startTimeIso: string, endTimeIso: string): boolean {
  const now = new Date();
  const start = new Date(startTimeIso);
  const end = new Date(endTimeIso);
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  // Started and not finished, or starting within next 3 hours
  return (start <= now && end >= now) || (start > now && start <= threeHoursFromNow);
}

/**
 * Checks if event is happening tonight (6:00 PM to 4:00 AM IST)
 */
export function isHappeningTonight(startTimeIso: string): boolean {
  const nowIst = toZonedTime(new Date(), HYDERABAD_TIMEZONE);
  const startIst = toZonedTime(new Date(startTimeIso), HYDERABAD_TIMEZONE);

  const isToday = isSameDay(nowIst, startIst);
  const startHour = startIst.getHours();

  if (isToday && startHour >= 18) return true;
  // If after midnight (0 to 4 AM) and matches early morning of tomorrow
  const isTomorrow = isSameDay(addDays(nowIst, 1), startIst);
  if (isTomorrow && startHour < 4) return true;

  return false;
}

/**
 * Checks if event is happening this weekend (Friday 5 PM to Sunday midnight)
 */
export function isHappeningThisWeekend(startTimeIso: string): boolean {
  const startIst = toZonedTime(new Date(startTimeIso), HYDERABAD_TIMEZONE);
  const day = getDay(startIst); // 0 = Sun, 5 = Fri, 6 = Sat
  const hour = startIst.getHours();

  if (day === 5 && hour >= 17) return true;
  if (day === 6 || day === 0) return true;
  return false;
}

/**
 * Converts any string into a URL safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
