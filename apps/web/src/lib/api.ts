import type { Event, Category, Banner, City, Venue } from '@pulse/contracts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Seed Fallback Data for resilient zero-downtime offline/build rendering
const FALLBACK_EVENTS: Event[] = [
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
    priceType: 'free',
    priceInr: 0,
    registrationUrl: 'https://lamakaan.com',
    publicationStatus: 'published',
    verificationStatus: 'official',
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
    priceType: 'paid',
    priceInr: 499,
    registrationUrl: 'https://roasterycoffeehouse.in/workshops',
    publicationStatus: 'published',
    verificationStatus: 'organizer_verified',
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
    priceType: 'free',
    priceInr: 0,
    registrationUrl: 'https://instagram.com/hyderabadwalks',
    publicationStatus: 'published',
    verificationStatus: 'community_verified',
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
    priceType: 'cover_charge',
    priceInr: 1000,
    registrationUrl: 'https://heartcupcoffee.com',
    publicationStatus: 'published',
    verificationStatus: 'official',
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

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Live Music', slug: 'music', iconName: 'Music', colorHex: '#8B5CF6', displayOrder: 1, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Nightlife', slug: 'nightlife', iconName: 'Sparkles', colorHex: '#EC4899', displayOrder: 2, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Food & Pop-ups', slug: 'food', iconName: 'Utensils', colorHex: '#F59E0B', displayOrder: 3, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Arts & Culture', slug: 'arts', iconName: 'Palette', colorHex: '#06B6D4', displayOrder: 4, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Fitness & Outdoor', slug: 'fitness', iconName: 'Activity', colorHex: '#10B981', displayOrder: 5, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'Workshops', slug: 'workshops', iconName: 'BookOpen', colorHex: '#6366F1', displayOrder: 6, isActive: true },
];

const FALLBACK_BANNER: Banner = {
  id: 'd1000000-0000-0000-0000-000000000001',
  cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
  title: 'Hyderabad Weekend Pop-Up Trail',
  subtitle: 'Explore 15+ curated gigs, artisan markets, and food pop-ups across Jubilee & Banjara Hills.',
  ctaText: 'Explore Now',
  destinationUrl: '/explore/hyderabad/music',
  placement: 'home_top',
  priority: 10,
  startsAt: new Date(Date.now() - 86400000).toISOString(),
  endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  isActive: true,
};

export async function fetchEvents(params?: {
  city?: string;
  category?: string;
  neighborhood?: string;
  timeWindow?: string;
}): Promise<Event[]> {
  try {
    const url = new URL(`${API_BASE}/api/v1/events`);
    if (params?.city) url.searchParams.set('city', params.city);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.neighborhood) url.searchParams.set('neighborhood', params.neighborhood);
    if (params?.timeWindow) url.searchParams.set('timeWindow', params.timeWindow);

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    return json.data || FALLBACK_EVENTS;
  } catch {
    // Graceful fallback during offline or initial cold start
    let items = [...FALLBACK_EVENTS];
    if (params?.category) {
      items = items.filter((e) => e.category?.slug === params.category);
    }
    return items;
  }
}

export async function fetchEventBySlug(citySlug: string, slug: string): Promise<Event | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/events/${citySlug}/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Not found');
    const json = await res.json();
    return json.data || null;
  } catch {
    return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data || FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/banners`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch banners');
    const json = await res.json();
    return json.data || [FALLBACK_BANNER];
  } catch {
    return [FALLBACK_BANNER];
  }
}

export async function submitEvent(payload: unknown) {
  const res = await fetch(`${API_BASE}/api/v1/events/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
