import { describe, it, expect } from 'vitest';
import { formatToIST, slugify, haversineDistanceKm } from '@oheyra/utils';
import { brand } from '@oheyra/config';

describe('Frontend Helpers & Utilities', () => {
  it('canonical brand configuration is accurate', () => {
    expect(brand.name).toBe('Oheyra');
    expect(brand.tagline).toBe('Your city has plans.');
    expect(brand.launchCity).toBe('Hyderabad');
    expect(brand.defaultCurrency).toBe('INR');
  });

  it('slugify converts titles accurately into URL-safe slugs', () => {
    expect(slugify('Acoustic Sunset & Indie Roots!')).toBe('acoustic-sunset-indie-roots');
    expect(slugify('Charminar Irani Chai Crawl 2026')).toBe('charminar-irani-chai-crawl-2026');
  });

  it('haversineDistanceKm calculates distance in km between Hyderabad coordinates', () => {
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
