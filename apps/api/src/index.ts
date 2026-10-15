import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { brand } from '@oheyra/config';
import {
  EventQuerySchema,
  EventSubmissionSchema,
  EventReportSchema,
  type Event,
  type Category,
  type Banner,
  type City,
  type Venue,
} from '@oheyra/contracts';
import {
  parseBoundingBox,
  isHappeningNow,
  isHappeningTonight,
  isHappeningThisWeekend,
  slugify,
} from '@oheyra/utils';

export type Bindings = {
  NODE_ENV?: string;
  WEB_ORIGIN?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

// ==========================================
// Seed Data (Resilient Fallback & Local Dev)
// ==========================================
const DEFAULT_CITIES: City[] = [
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000001',
    name: 'Hyderabad',
    slug: 'hyderabad',
    state: 'Telangana',
    countryCode: 'IN',
    center: { lat: 17.385, lng: 78.4867 },
    defaultZoom: 12,
    isActive: true,
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Live Music', slug: 'music', iconName: 'Music', colorHex: '#8B5CF6', displayOrder: 1, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Nightlife', slug: 'nightlife', iconName: 'Sparkles', colorHex: '#EC4899', displayOrder: 2, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Food & Pop-ups', slug: 'food', iconName: 'Utensils', colorHex: '#F59E0B', displayOrder: 3, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Arts & Culture', slug: 'arts', iconName: 'Palette', colorHex: '#06B6D4', displayOrder: 4, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Fitness & Outdoor', slug: 'fitness', iconName: 'Activity', colorHex: '#10B981', displayOrder: 5, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'Workshops', slug: 'workshops', iconName: 'BookOpen', colorHex: '#6366F1', displayOrder: 6, isActive: true },
];

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    title: 'Hyderabad Weekend Pop-Up Trail',
    subtitle: 'Explore 15+ curated acoustic gigs, artisan markets, and food pop-ups.',
    ctaText: 'Explore Now',
    destinationUrl: '/explore/hyderabad/music',
    placement: 'home_top',
    priority: 10,
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    isActive: true,
  },
];

const DEFAULT_VENUES: Venue[] = [
  {
    id: 'v1000000-0000-0000-0000-000000000001',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    neighborhood: 'Banjara Hills',
    name: 'Roastery Coffee House',
    slug: 'roastery-coffee-house',
    address: 'Road No. 14, Banjara Hills, Hyderabad',
    location: { lat: 17.4239, lng: 78.4358 },
    googleMapsUrl: 'https://maps.google.com/?q=Roastery+Coffee+House+Banjara+Hills',
    instagramHandle: '@roasterycoffeehousehyd',
  },
  {
    id: 'v1000000-0000-0000-0000-000000000002',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    neighborhood: 'Banjara Hills',
    name: 'Lamakaan',
    slug: 'lamakaan-cultural-space',
    address: 'Off Road No. 1, Banjara Hills, Hyderabad',
    location: { lat: 17.419, lng: 78.4498 },
    googleMapsUrl: 'https://maps.google.com/?q=Lamakaan+Hyderabad',
    instagramHandle: '@lamakaan_hyderabad',
  },
  {
    id: 'v1000000-0000-0000-0000-000000000004',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    neighborhood: 'Jubilee Hills',
    name: 'Tabula Rasa - Café & Bar',
    slug: 'tabula-rasa-jubilee-hills',
    address: 'Road No. 67, Jubilee Hills, Hyderabad',
    location: { lat: 17.4284, lng: 78.397 },
    googleMapsUrl: 'https://maps.google.com/?q=Tabula+Rasa+Hyderabad',
    instagramHandle: '@tabularasacafebar',
  },
];

const SEED_EVENTS: Event[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    venueId: 'v1000000-0000-0000-0000-000000000004',
    categoryId: 'c1000000-0000-0000-0000-000000000001',
    title: 'Acoustic Sunset & Indie Roots',
    slug: 'acoustic-sunset-indie-roots',
    description: 'An intimate evening of open-air acoustic covers and indie originals beneath the green canopy of Jubilee Hills. Featuring local singer-songwriters Rohan & Tara.',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    startTime: new Date(Date.now() + 2 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 5 * 3600000).toISOString(),
    location: { lat: 17.4284, lng: 78.397 },
    priceType: 'free',
    priceInr: 0,
    registrationUrl: 'https://tabularasahyd.com',
    publicationStatus: 'published',
    verificationStatus: 'official',
    isFeatured: true,
    organizerName: 'Tabula Collective',
    organizerContact: 'events@tabularasahyd.com',
    category: DEFAULT_CATEGORIES[0],
    venue: DEFAULT_VENUES[2],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000002',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    venueId: 'v1000000-0000-0000-0000-000000000002',
    categoryId: 'c1000000-0000-0000-0000-000000000004',
    title: 'Lamakaan Open Mic & Spoken Word',
    slug: 'lamakaan-open-mic-spoken-word',
    description: "Hyderabad's longest-running inclusive open stage. Poetry, storytelling, stand-up comedy, and acoustic music. Free entry and authentic organic chai.",
    coverImageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    startTime: new Date(Date.now() + 27 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 30 * 3600000).toISOString(),
    location: { lat: 17.419, lng: 78.4498 },
    priceType: 'free',
    priceInr: 0,
    registrationUrl: 'https://lamakaan.com',
    publicationStatus: 'published',
    verificationStatus: 'official',
    isFeatured: false,
    organizerName: 'Lamakaan Arts Trust',
    organizerContact: 'contact@lamakaan.com',
    category: DEFAULT_CATEGORIES[3],
    venue: DEFAULT_VENUES[1],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000003',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    venueId: 'v1000000-0000-0000-0000-000000000001',
    categoryId: 'c1000000-0000-0000-0000-000000000003',
    title: 'Artisanal Coffee Tasting & Pour-Over Lab',
    slug: 'artisanal-coffee-tasting-pour-over-lab',
    description: 'Taste five distinct single-origin beans from Chikmagalur and Araku Valley. Master brewing temperatures, grind ratios, and flavor notes with certified head roasters.',
    coverImageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    startTime: new Date(Date.now() + 52 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 54 * 3600000).toISOString(),
    location: { lat: 17.4239, lng: 78.4358 },
    priceType: 'paid',
    priceInr: 499,
    registrationUrl: 'https://roasterycoffeehouse.in/workshops',
    publicationStatus: 'published',
    verificationStatus: 'organizer_verified',
    isFeatured: true,
    organizerName: 'Roastery Academy',
    organizerContact: 'hello@roasterycoffeehouse.in',
    category: DEFAULT_CATEGORIES[2],
    venue: DEFAULT_VENUES[0],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000004',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    venueId: 'v1000000-0000-0000-0000-000000000006',
    categoryId: 'c1000000-0000-0000-0000-000000000004',
    title: 'Twilight Old City Photowalk & Irani Chai Crawl',
    slug: 'twilight-old-city-photowalk',
    description: 'Explore the winding lanes around Charminar at dusk. Capture the glowing minarets, antique perfume bazaars, and finish with Osmania biscuits at Nimrah Café.',
    coverImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    startTime: new Date(Date.now() + 73 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 76 * 3600000).toISOString(),
    location: { lat: 17.3616, lng: 78.4747 },
    priceType: 'free',
    priceInr: 0,
    registrationUrl: 'https://instagram.com/hyderabadwalks',
    publicationStatus: 'published',
    verificationStatus: 'community_verified',
    isFeatured: true,
    organizerName: 'Hyderabad Urban Photographers',
    organizerContact: 'curator@hydphoto.club',
    category: DEFAULT_CATEGORIES[3],
    venue: {
      id: 'v1000000-0000-0000-0000-000000000006',
      cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
      neighborhood: 'Old City',
      name: 'Charminar Heritage Plaza',
      slug: 'charminar-heritage-plaza',
      address: 'Char Kaman, Ghansi Bazaar, Hyderabad',
      location: { lat: 17.3616, lng: 78.4747 },
      googleMapsUrl: 'https://maps.google.com/?q=Charminar+Hyderabad',
    },
  },
  {
    id: 'e1000000-0000-0000-0000-000000000005',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    venueId: 'v1000000-0000-0000-0000-000000000003',
    categoryId: 'c1000000-0000-0000-0000-000000000002',
    title: 'Deep House & Synthwave Night',
    slug: 'deep-house-synthwave-night',
    description: 'High-octane electronic and synthwave grooves by DJ Varun. Neon visuals, craft cocktails, and high-energy crowd in the heart of Road 45.',
    coverImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    startTime: new Date(Date.now() + 12 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 18 * 3600000).toISOString(),
    location: { lat: 17.4357, lng: 78.4025 },
    priceType: 'cover_charge',
    priceInr: 1000,
    registrationUrl: 'https://heartcupcoffee.com',
    publicationStatus: 'published',
    verificationStatus: 'official',
    isFeatured: false,
    organizerName: 'Heart Cup Events',
    organizerContact: 'bookings@heartcupcoffee.com',
    category: DEFAULT_CATEGORIES[1],
    venue: {
      id: 'v1000000-0000-0000-0000-000000000003',
      cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
      neighborhood: 'Jubilee Hills',
      name: 'Heart Cup Coffee',
      slug: 'heart-cup-coffee-jubilee-hills',
      address: 'Plot 1179, Road No. 45, Jubilee Hills, Hyderabad',
      location: { lat: 17.4357, lng: 78.4025 },
      googleMapsUrl: 'https://maps.google.com/?q=Heart+Cup+Coffee+Jubilee+Hills',
    },
  },
];

// ==========================================
// Application Factory
// ==========================================
export function createApp() {
  const app = new Hono<{ Bindings: Bindings }>();

  // CORS Middleware
  app.use('*', cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // Global Error Handler
  app.onError((err, c) => {
    console.error('API Error:', err);
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected error occurred.',
      },
    }, 500);
  });

  // Global 404 Handler
  app.notFound((c) => {
    return c.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found on this server.',
      },
    }, 404);
  });

  // 1. Health Checks
  const healthHandler = (c: any) => {
    return c.json({
      success: true,
      data: {
        status: 'healthy',
        brand: brand.name,
        tagline: brand.tagline,
        service: 'oheyra-api',
        runtime: 'cloudflare-workers',
        timestamp: new Date().toISOString(),
      },
    });
  };

  app.get('/health', healthHandler);
  app.get('/api/v1/health', healthHandler);

  // 2. Cities
  app.get('/api/v1/cities', (c) => {
    return c.json({ success: true, data: DEFAULT_CITIES });
  });

  app.get('/api/v1/cities/:slug', (c) => {
    const slug = c.req.param('slug');
    const city = DEFAULT_CITIES.find((item) => item.slug === slug);
    if (!city) {
      return c.json({
        success: false,
        error: { code: 'CITY_NOT_FOUND', message: `City '${slug}' is not supported yet.` },
      }, 404);
    }
    return c.json({ success: true, data: city });
  });

  // 3. Categories
  app.get('/api/v1/categories', (c) => {
    return c.json({ success: true, data: DEFAULT_CATEGORIES });
  });

  // 4. Banners
  app.get('/api/v1/banners', (c) => {
    return c.json({ success: true, data: DEFAULT_BANNERS });
  });

  // 5. Venues
  app.get('/api/v1/venues/:citySlug/:slug', (c) => {
    const slug = c.req.param('slug');
    const venue = DEFAULT_VENUES.find((v) => v.slug === slug);
    if (!venue) {
      return c.json({
        success: false,
        error: { code: 'VENUE_NOT_FOUND', message: `Venue '${slug}' was not found.` },
      }, 404);
    }
    return c.json({ success: true, data: venue });
  });

  // 6. Discovery Events Feed
  app.get('/api/v1/events', (c) => {
    const rawQuery = c.req.query();
    const query = EventQuerySchema.parse(rawQuery);

    let filtered = [...SEED_EVENTS];

    if (query.category) {
      filtered = filtered.filter((e) => e.category?.slug === query.category);
    }

    if (query.neighborhood) {
      filtered = filtered.filter(
        (e) => e.venue?.neighborhood?.toLowerCase().replace(/\s+/g, '-') === query.neighborhood?.toLowerCase()
      );
    }

    if (query.timeWindow === 'now') {
      filtered = filtered.filter((e) => isHappeningNow(e.startTime, e.endTime));
    } else if (query.timeWindow === 'tonight') {
      filtered = filtered.filter((e) => isHappeningTonight(e.startTime));
    } else if (query.timeWindow === 'weekend') {
      filtered = filtered.filter((e) => isHappeningThisWeekend(e.startTime));
    }

    if (query.bbox) {
      const parsedBox = parseBoundingBox(query.bbox);
      if (parsedBox) {
        filtered = filtered.filter((e) => {
          return (
            e.location.lng >= parsedBox.minLng &&
            e.location.lng <= parsedBox.maxLng &&
            e.location.lat >= parsedBox.minLat &&
            e.location.lat <= parsedBox.maxLat
          );
        });
      }
    }

    const limit = query.limit || 30;
    const items = filtered.slice(0, limit);

    return c.json({
      success: true,
      data: items,
      pagination: {
        totalCount: filtered.length,
        hasMore: filtered.length > limit,
      },
    });
  });

  // 7. Canonical Event Lookup
  app.get('/api/v1/events/:citySlug/:slug', (c) => {
    const slug = c.req.param('slug');
    const event = SEED_EVENTS.find((e) => e.slug === slug);

    if (!event) {
      return c.json({
        success: false,
        error: { code: 'EVENT_NOT_FOUND', message: `Event '${slug}' does not exist or has expired.` },
      }, 404);
    }

    return c.json({ success: true, data: event });
  });

  // 8. Public Event Submission (Honeypot protected)
  app.post('/api/v1/events/submit', async (c) => {
    const body = await c.req.json();
    const parsed = EventSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The submitted event failed validation.',
          details: parsed.error.flatten(),
        },
      }, 400);
    }

    if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
      return c.json({ success: true, data: { message: 'Submission received for review.' } });
    }

    const createdEvent: Event = {
      id: crypto.randomUUID(),
      cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
      venueId: crypto.randomUUID(),
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      slug: slugify(parsed.data.title),
      description: parsed.data.description,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      location: { lat: parsed.data.lat, lng: parsed.data.lng },
      priceType: parsed.data.priceType,
      priceInr: parsed.data.priceInr,
      registrationUrl: parsed.data.registrationUrl || '',
      coverImageUrl: parsed.data.coverImageUrl,
      publicationStatus: 'published',
      verificationStatus: 'community_verified',
      isFeatured: false,
      organizerName: parsed.data.organizerName,
      organizerContact: parsed.data.organizerContact,
      category: DEFAULT_CATEGORIES.find((c) => c.id === parsed.data.categoryId) || DEFAULT_CATEGORIES[0],
      venue: {
        id: crypto.randomUUID(),
        cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
        neighborhood: 'Hyderabad',
        name: parsed.data.venueName,
        slug: slugify(parsed.data.venueName),
        address: parsed.data.address,
        location: { lat: parsed.data.lat, lng: parsed.data.lng },
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(parsed.data.venueName)}`,
      },
    };

    SEED_EVENTS.unshift(createdEvent);

    return c.json({
      success: true,
      data: {
        message: 'Event submitted successfully! It is now live on the map.',
        event: createdEvent,
      },
    }, 201);
  });

  // 9. Community Event Reporting
  app.post('/api/v1/events/report', async (c) => {
    const body = await c.req.json();
    const parsed = EventReportSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid report payload.' },
      }, 400);
    }

    return c.json({
      success: true,
      data: {
        message: 'Thank you for keeping Hyderabad updated. Our team will verify this report.',
        reportId: crypto.randomUUID(),
        reason: parsed.data.reason,
      },
    }, 201);
  });

  // 10. Saved Favorites
  app.get('/api/v1/me/favorites', (c) => {
    const auth = c.req.header('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to access saved favorites.' },
      }, 401);
    }
    return c.json({ success: true, data: [] });
  });

  app.post('/api/v1/me/favorites', async (c) => {
    const auth = c.req.header('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to save favorites.' },
      }, 401);
    }
    const body = await c.req.json().catch(() => ({}));
    return c.json({ success: true, data: { eventId: body.eventId, favorited: true } });
  });

  return app;
}

const app = createApp();
export default app;
