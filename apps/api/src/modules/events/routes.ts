import { FastifyPluginAsync } from 'fastify';
import { EventQuerySchema, EventSubmissionSchema, EventReportSchema } from '@pulse/contracts';
import { parseBoundingBox, isHappeningNow, isHappeningTonight, isHappeningThisWeekend, slugify } from '@pulse/utils';

const SEED_EVENTS = [
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
    priceType: 'free' as const,
    priceInr: 0,
    registrationUrl: 'https://tabularasahyd.com',
    publicationStatus: 'published' as const,
    verificationStatus: 'official' as const,
    isFeatured: true,
    organizerName: 'Tabula Collective',
    organizerContact: 'events@tabularasahyd.com',
    category: {
      id: 'c1000000-0000-0000-0000-000000000001',
      name: 'Live Music',
      slug: 'music',
      iconName: 'Music',
      colorHex: '#8B5CF6',
      displayOrder: 1,
      isActive: true,
    },
    venue: {
      id: 'v1000000-0000-0000-0000-000000000004',
      cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
      neighborhood: 'Jubilee Hills',
      name: 'Tabula Rasa - Café & Bar',
      slug: 'tabula-rasa-jubilee-hills',
      address: 'Road No. 67, Jubilee Hills, Hyderabad',
      location: { lat: 17.4284, lng: 78.397 },
      googleMapsUrl: 'https://maps.google.com/?q=Tabula+Rasa+Hyderabad',
    },
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
    priceType: 'free' as const,
    priceInr: 0,
    registrationUrl: 'https://lamakaan.com',
    publicationStatus: 'published' as const,
    verificationStatus: 'official' as const,
    isFeatured: false,
    organizerName: 'Lamakaan Arts Trust',
    organizerContact: 'contact@lamakaan.com',
    category: {
      id: 'c1000000-0000-0000-0000-000000000004',
      name: 'Arts & Culture',
      slug: 'arts',
      iconName: 'Palette',
      colorHex: '#06B6D4',
      displayOrder: 4,
      isActive: true,
    },
    venue: {
      id: 'v1000000-0000-0000-0000-000000000002',
      cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
      neighborhood: 'Banjara Hills',
      name: 'Lamakaan',
      slug: 'lamakaan-cultural-space',
      address: 'Off Road No. 1, Banjara Hills, Hyderabad',
      location: { lat: 17.419, lng: 78.4498 },
      googleMapsUrl: 'https://maps.google.com/?q=Lamakaan+Hyderabad',
    },
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
    priceType: 'paid' as const,
    priceInr: 499,
    registrationUrl: 'https://roasterycoffeehouse.in/workshops',
    publicationStatus: 'published' as const,
    verificationStatus: 'organizer_verified' as const,
    isFeatured: true,
    organizerName: 'Roastery Academy',
    organizerContact: 'hello@roasterycoffeehouse.in',
    category: {
      id: 'c1000000-0000-0000-0000-000000000003',
      name: 'Food & Pop-ups',
      slug: 'food',
      iconName: 'Utensils',
      colorHex: '#F59E0B',
      displayOrder: 3,
      isActive: true,
    },
    venue: {
      id: 'v1000000-0000-0000-0000-000000000001',
      cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
      neighborhood: 'Banjara Hills',
      name: 'Roastery Coffee House',
      slug: 'roastery-coffee-house',
      address: 'Road No. 14, Banjara Hills, Hyderabad',
      location: { lat: 17.4239, lng: 78.4358 },
      googleMapsUrl: 'https://maps.google.com/?q=Roastery+Coffee+House+Banjara+Hills',
    },
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
    priceType: 'free' as const,
    priceInr: 0,
    registrationUrl: 'https://instagram.com/hyderabadwalks',
    publicationStatus: 'published' as const,
    verificationStatus: 'community_verified' as const,
    isFeatured: true,
    organizerName: 'Hyderabad Urban Photographers',
    organizerContact: 'curator@hydphoto.club',
    category: {
      id: 'c1000000-0000-0000-0000-000000000004',
      name: 'Arts & Culture',
      slug: 'arts',
      iconName: 'Palette',
      colorHex: '#06B6D4',
      displayOrder: 4,
      isActive: true,
    },
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
    priceType: 'cover_charge' as const,
    priceInr: 1000,
    registrationUrl: 'https://heartcupcoffee.com',
    publicationStatus: 'published' as const,
    verificationStatus: 'official' as const,
    isFeatured: false,
    organizerName: 'Heart Cup Events',
    organizerContact: 'bookings@heartcupcoffee.com',
    category: {
      id: 'c1000000-0000-0000-0000-000000000002',
      name: 'Nightlife',
      slug: 'nightlife',
      iconName: 'Sparkles',
      colorHex: '#EC4899',
      displayOrder: 2,
      isActive: true,
    },
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

export const eventRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Discovery Feed
  fastify.get('/api/v1/events', async (request, reply) => {
    const query = EventQuerySchema.parse(request.query);

    let filtered = [...SEED_EVENTS];

    // Filter by category
    if (query.category) {
      filtered = filtered.filter((e) => e.category?.slug === query.category);
    }

    // Filter by neighborhood
    if (query.neighborhood) {
      filtered = filtered.filter(
        (e) => e.venue?.neighborhood?.toLowerCase().replace(/\s+/g, '-') === query.neighborhood?.toLowerCase()
      );
    }

    // Filter by time window
    if (query.timeWindow === 'now') {
      filtered = filtered.filter((e) => isHappeningNow(e.startTime, e.endTime));
    } else if (query.timeWindow === 'tonight') {
      filtered = filtered.filter((e) => isHappeningTonight(e.startTime));
    } else if (query.timeWindow === 'weekend') {
      filtered = filtered.filter((e) => isHappeningThisWeekend(e.startTime));
    }

    // Filter by bounding box if provided
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

    // Bounded limit
    const limit = query.limit || 30;
    const items = filtered.slice(0, limit);

    return reply.send({
      success: true,
      data: items,
      pagination: {
        totalCount: filtered.length,
        hasMore: filtered.length > limit,
      },
    });
  });

  // 2. Canonical Event Lookup by Slug
  fastify.get<{ Params: { citySlug: string; slug: string } }>(
    '/api/v1/events/:citySlug/:slug',
    async (request, reply) => {
      const { slug } = request.params;
      const event = SEED_EVENTS.find((e) => e.slug === slug);

      if (!event) {
        return reply.status(404).send({
          success: false,
          error: { code: 'EVENT_NOT_FOUND', message: `Event '${slug}' does not exist or has expired.` },
        });
      }

      return reply.send({ success: true, data: event });
    }
  );

  // 3. Public Event Submission (Honeypot + Rate Limited)
  fastify.post('/api/v1/events/submit', async (request, reply) => {
    const body = EventSubmissionSchema.parse(request.body);

    // Honeypot spam check
    if (body.honeypot && body.honeypot.length > 0) {
      return reply.status(200).send({
        success: true,
        data: { message: 'Submission received for review.' },
      });
    }

    const newSlug = slugify(body.title);

    // Save as pending_review
    const createdEvent = {
      id: crypto.randomUUID(),
      title: body.title,
      slug: newSlug,
      description: body.description,
      startTime: body.startTime,
      endTime: body.endTime,
      priceType: body.priceType,
      priceInr: body.priceInr,
      coverImageUrl: body.coverImageUrl,
      registrationUrl: body.registrationUrl || null,
      publicationStatus: 'pending_review',
      verificationStatus: 'unverified',
      organizerName: body.organizerName,
      createdAt: new Date().toISOString(),
    };

    return reply.status(201).send({
      success: true,
      data: {
        message: 'Event submitted successfully! Our curation team will verify it within 4 hours.',
        event: createdEvent,
      },
    });
  });

  // 4. Public Event Reporting / Flagging
  fastify.post('/api/v1/events/report', async (request, reply) => {
    const body = EventReportSchema.parse(request.body);

    return reply.status(201).send({
      success: true,
      data: {
        message: 'Thank you for keeping Hyderabad updated. Our team will verify this report.',
        reportId: crypto.randomUUID(),
        reason: body.reason,
      },
    });
  });
};
