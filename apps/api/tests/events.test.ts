import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';

describe('Event Endpoints', () => {
  const app = createApp();

  it('GET /api/v1/events returns list of events with pagination envelope', async () => {
    const res = await app.request('/api/v1/events');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.pagination).toBeDefined();
  });

  it('GET /api/v1/events/:citySlug/:slug returns single event or 404', async () => {
    const res = await app.request('/api/v1/events/hyderabad/acoustic-sunset-indie-roots');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe('acoustic-sunset-indie-roots');
  });

  it('POST /api/v1/events/submit creates pending review event', async () => {
    const newEvent = {
      citySlug: 'hyderabad',
      title: 'KBR Park Morning Birdwalk',
      categoryId: 'c1000000-0000-0000-0000-000000000005',
      venueName: 'KBR National Park Gate 1',
      address: 'Road No. 2, Banjara Hills, Hyderabad',
      lat: 17.423,
      lng: 78.428,
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 93600000).toISOString(),
      priceType: 'free',
      priceInr: 0,
      description: 'Join local naturalists for a peaceful Sunday morning birdwatching walk inside KBR Park.',
      coverImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      organizerName: 'Hyderabad Birding Club',
      organizerContact: 'birds@kbrwalks.org',
    };

    const res = await app.request('/api/v1/events/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.event.publicationStatus).toBe('pending_review');
  });

  it('GET /api/v1/banners returns active banners', async () => {
    const res = await app.request('/api/v1/banners');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
