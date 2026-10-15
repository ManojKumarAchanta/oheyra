import { describe, it, expect } from 'vitest';
import { formatToIST, slugify, haversineDistanceKm } from '@pulse/utils';

describe('Frontend Helpers & Utilities', () => {
  it('slugify converts titles accurately into URL-safe slugs', () => {
    expect(slugify('Acoustic Sunset & Indie Roots!')).toBe('acoustic-sunset-indie-roots');
    expect(slugify('Charminar Irani Chai Crawl 2026')).toBe('charminar-irani-chai-crawl-2026');
  });

  it('haversineDistanceKm calculates distance in km between Hyderabad coordinates', () => {
    // Jubilee Hills to Banjara Hills (~4km)
    const jubilee = { lat: 17.4319, lng: 78.4069 };
    const banjara = { lat: 17.4156, lng: 78.4419 };
    const distance = haversineDistanceKm(jubilee, banjara);
    expect(distance).toBeGreaterThan(3);
    expect(distance).toBeLessThan(6);
  });

  it('formatToIST formats UTC date properly in Indian Standard Time', () => {
    const utcDate = '2026-10-16T14:30:00.000Z'; // 20:00 IST
    const formatted = formatToIST(utcDate, 'h:mm a');
    expect(formatted).toBe('8:00 PM');
  });
});
