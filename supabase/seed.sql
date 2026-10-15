-- PULSE Hyderabad Seed Data
-- Seed: supabase/seed.sql

-- 1. Insert Hyderabad City
INSERT INTO cities (id, name, slug, state, country_code, center_location, default_zoom, is_active)
VALUES (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Hyderabad',
    'hyderabad',
    'Telangana',
    'IN',
    ST_SetSRID(ST_MakePoint(78.4867, 17.3850), 4326),
    12,
    true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Neighborhoods
INSERT INTO neighborhoods (id, city_id, name, slug, center_location, is_active)
VALUES 
(
    'b1000000-0000-0000-0000-000000000001',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Jubilee Hills',
    'jubilee-hills',
    ST_SetSRID(ST_MakePoint(78.4069, 17.4319), 4326),
    true
),
(
    'b1000000-0000-0000-0000-000000000002',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Banjara Hills',
    'banjara-hills',
    ST_SetSRID(ST_MakePoint(78.4419, 17.4156), 4326),
    true
),
(
    'b1000000-0000-0000-0000-000000000003',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Gachibowli & Hitec City',
    'gachibowli-hitec-city',
    ST_SetSRID(ST_MakePoint(78.3688, 17.4435), 4326),
    true
),
(
    'b1000000-0000-0000-0000-000000000004',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Old City / Charminar',
    'old-city',
    ST_SetSRID(ST_MakePoint(78.4747, 17.3616), 4326),
    true
)
ON CONFLICT (city_id, slug) DO NOTHING;

-- 3. Insert Categories
INSERT INTO categories (id, name, slug, icon_name, color_hex, display_order, is_active)
VALUES 
('c1000000-0000-0000-0000-000000000001', 'Live Music', 'music', 'Music', '#8B5CF6', 1, true),
('c1000000-0000-0000-0000-000000000002', 'Nightlife', 'nightlife', 'Sparkles', '#EC4899', 2, true),
('c1000000-0000-0000-0000-000000000003', 'Food & Pop-ups', 'food', 'Utensils', '#F59E0B', 3, true),
('c1000000-0000-0000-0000-000000000004', 'Arts & Culture', 'arts', 'Palette', '#06B6D4', 4, true),
('c1000000-0000-0000-0000-000000000005', 'Fitness & Outdoor', 'fitness', 'Activity', '#10B981', 5, true),
('c1000000-0000-0000-0000-000000000006', 'Workshops', 'workshops', 'BookOpen', '#6366F1', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Verified Venues
INSERT INTO venues (id, city_id, neighborhood_id, name, slug, address, location, google_maps_url, instagram_handle)
VALUES
(
    'v1000000-0000-0000-0000-000000000001',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'Roastery Coffee House',
    'roastery-coffee-house',
    'Road No. 14, Banjara Hills, Hyderabad',
    ST_SetSRID(ST_MakePoint(78.4358, 17.4239), 4326),
    'https://maps.google.com/?q=Roastery+Coffee+House+Banjara+Hills',
    '@roasterycoffeehousehyd'
),
(
    'v1000000-0000-0000-0000-000000000002',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'Lamakaan',
    'lamakaan-cultural-space',
    'Off Road No. 1, Banjara Hills, Hyderabad',
    ST_SetSRID(ST_MakePoint(78.4498, 17.4190), 4326),
    'https://maps.google.com/?q=Lamakaan+Hyderabad',
    '@lamakaan_hyderabad'
),
(
    'v1000000-0000-0000-0000-000000000003',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Heart Cup Coffee',
    'heart-cup-coffee-jubilee-hills',
    'Plot 1179, Road No. 45, Jubilee Hills, Hyderabad',
    ST_SetSRID(ST_MakePoint(78.4025, 17.4357), 4326),
    'https://maps.google.com/?q=Heart+Cup+Coffee+Jubilee+Hills',
    '@heartcupcoffee'
),
(
    'v1000000-0000-0000-0000-000000000004',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Tabula Rasa - Café & Bar',
    'tabula-rasa-jubilee-hills',
    'Road No. 67, Jubilee Hills, Hyderabad',
    ST_SetSRID(ST_MakePoint(78.3970, 17.4284), 4326),
    'https://maps.google.com/?q=Tabula+Rasa+Hyderabad',
    '@tabularasacafebar'
),
(
    'v1000000-0000-0000-0000-000000000005',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000003',
    'State Gallery of Art',
    'state-gallery-of-art',
    'Road No. 1, Kavuri Hills, Madhapur, Hyderabad',
    ST_SetSRID(ST_MakePoint(78.3888, 17.4420), 4326),
    'https://maps.google.com/?q=State+Gallery+of+Art+Hyderabad',
    '@stategalleryart'
),
(
    'v1000000-0000-0000-0000-000000000006',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000004',
    'Charminar Heritage Plaza',
    'charminar-heritage-plaza',
    'Char Kaman, Ghansi Bazaar, Hyderabad',
    ST_SetSRID(ST_MakePoint(78.4747, 17.3616), 4326),
    'https://maps.google.com/?q=Charminar+Hyderabad',
    '@hyderabadwalks'
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Curated Active Events (Relative to current time)
INSERT INTO events (
    id, city_id, venue_id, category_id, title, slug, description,
    cover_image_url, start_time, end_time, location, price_type, price_inr,
    registration_url, publication_status, verification_status, is_featured,
    organizer_name, organizer_contact
)
VALUES
(
    'e1000000-0000-0000-0000-000000000001',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'v1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000001',
    'Acoustic Sunset & Indie Roots',
    'acoustic-sunset-indie-roots',
    'An intimate evening of open-air acoustic covers and indie originals beneath the green canopy of Jubilee Hills. Featuring local singer-songwriters Rohan & Tara.',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    timezone('utc', now() + interval '2 hours'),
    timezone('utc', now() + interval '5 hours'),
    ST_SetSRID(ST_MakePoint(78.3970, 17.4284), 4326),
    'free',
    0.00,
    'https://tabularasahyd.com',
    'published',
    'official',
    true,
    'Tabula Collective',
    'events@tabularasahyd.com'
),
(
    'e1000000-0000-0000-0000-000000000002',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'v1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000004',
    'Lamakaan Open Mic & Spoken Word',
    'lamakaan-open-mic-spoken-word',
    'Hyderabad''s longest-running inclusive open stage. Poetry, storytelling, stand-up comedy, and acoustic music. Free entry and authentic organic chai.',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    timezone('utc', now() + interval '1 day' + interval '3 hours'),
    timezone('utc', now() + interval '1 day' + interval '6 hours'),
    ST_SetSRID(ST_MakePoint(78.4498, 17.4190), 4326),
    'free',
    0.00,
    'https://lamakaan.com',
    'published',
    'official',
    false,
    'Lamakaan Arts Trust',
    'contact@lamakaan.com'
),
(
    'e1000000-0000-0000-0000-000000000003',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'v1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    'Artisanal Coffee Tasting & Pour-Over Lab',
    'artisanal-coffee-tasting-pour-over-lab',
    'Taste five distinct single-origin beans from Chikmagalur and Araku Valley. Master brewing temperatures, grind ratios, and flavor notes with certified head roasters.',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    timezone('utc', now() + interval '2 days' + interval '4 hours'),
    timezone('utc', now() + interval '2 days' + interval '6 hours'),
    ST_SetSRID(ST_MakePoint(78.4358, 17.4239), 4326),
    'paid',
    499.00,
    'https://roasterycoffeehouse.in/workshops',
    'published',
    'organizer_verified',
    true,
    'Roastery Academy',
    'hello@roasterycoffeehouse.in'
),
(
    'e1000000-0000-0000-0000-000000000004',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'v1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000004',
    'Twilight Old City Photowalk & Irani Chai Crawl',
    'twilight-old-city-photowalk',
    'Explore the winding lanes around Charminar at dusk. Capture the glowing minarets, antique perfume bazaars, and finish with Osmania biscuits at Nimrah Café.',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    timezone('utc', now() + interval '3 days' + interval '1 hour'),
    timezone('utc', now() + interval '3 days' + interval '4 hours'),
    ST_SetSRID(ST_MakePoint(78.4747, 17.3616), 4326),
    'free',
    0.00,
    'https://instagram.com/hyderabadwalks',
    'published',
    'community_verified',
    true,
    'Hyderabad Urban Photographers',
    'curator@hydphoto.club'
),
(
    'e1000000-0000-0000-0000-000000000005',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'v1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'Deep House & Synthwave Night',
    'deep-house-synthwave-night',
    'High-octane electronic and synthwave grooves by DJ Varun. Neon visuals, craft cocktails, and high-energy crowd in the heart of Road 45.',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    timezone('utc', now() + interval '12 hours'),
    timezone('utc', now() + interval '18 hours'),
    ST_SetSRID(ST_MakePoint(78.4025, 17.4357), 4326),
    'cover_charge',
    1000.00,
    'https://heartcupcoffee.com',
    'published',
    'official',
    false,
    'Heart Cup Events',
    'bookings@heartcupcoffee.com'
)
ON CONFLICT (city_id, slug) DO NOTHING;

-- 6. Insert Dynamic Promotional Banner
INSERT INTO banners (
    id, city_id, title, subtitle, cta_text, destination_url,
    placement, priority, starts_at, ends_at, is_active
)
VALUES (
    'd1000000-0000-0000-0000-000000000001',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Weekend Hyderabad Pop-Up Trail',
    'Explore 15+ curated gigs, artisan markets, and food pop-ups across Jubilee & Banjara Hills.',
    'Explore Now',
    '/explore/hyderabad/music',
    'home_top',
    10,
    timezone('utc', now() - interval '1 day'),
    timezone('utc', now() + interval '30 days'),
    true
) ON CONFLICT DO NOTHING;
