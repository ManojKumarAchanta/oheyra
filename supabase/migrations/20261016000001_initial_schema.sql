-- Oheyra Initial Production Schema Migration
-- Migration: 20261016000001_initial_schema.sql
-- Description: Core tables, PostGIS geography types, indexes, and RLS policies

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. CITIES
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    country_code VARCHAR(2) NOT NULL DEFAULT 'IN',
    center_location GEOGRAPHY(Point, 4326) NOT NULL,
    default_zoom SMALLINT NOT NULL DEFAULT 12,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. NEIGHBORHOODS
CREATE TABLE IF NOT EXISTS neighborhoods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    center_location GEOGRAPHY(Point, 4326) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(city_id, slug)
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#8B5CF6',
    display_order SMALLINT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. VENUES
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id),
    neighborhood_id UUID REFERENCES neighborhoods(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    google_maps_url TEXT,
    website_url TEXT,
    instagram_handle TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id),
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    price_type TEXT NOT NULL DEFAULT 'free' CHECK (price_type IN ('free', 'paid', 'cover_charge')),
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    registration_url TEXT,
    publication_status TEXT NOT NULL DEFAULT 'published' 
        CHECK (publication_status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'community_verified', 'organizer_verified', 'official')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    organizer_name TEXT NOT NULL,
    organizer_contact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT chk_event_times CHECK (end_time > start_time),
    UNIQUE(city_id, slug)
);

-- 7. DYNAMIC BANNERS
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES cities(id),
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT NOT NULL,
    destination_url TEXT NOT NULL,
    image_url TEXT,
    placement TEXT NOT NULL DEFAULT 'home_top' CHECK (placement IN ('home_top', 'feed_interstitial')),
    priority SMALLINT NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    click_count INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT chk_banner_dates CHECK (ends_at > starts_at)
);

-- 8. USER FAVORITES (Optional authenticated feature)
CREATE TABLE IF NOT EXISTS favorite_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(user_id, event_id)
);

-- 9. EVENT REPORTS & COMMUNITY CORRECTIONS
CREATE TABLE IF NOT EXISTS event_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    report_reason TEXT NOT NULL CHECK (report_reason IN ('cancelled', 'wrong_time', 'wrong_location', 'misleading', 'spam')),
    details TEXT,
    reporter_ip_hash TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =========================================================
-- INDEXES FOR SUB-10MS GEOSPATIAL & DISCOVERY QUERIES
-- =========================================================

-- Spatial GiST indexes for PostGIS
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIST(location);

-- Feed Query Multi-Column Index
CREATE INDEX IF NOT EXISTS idx_events_discovery ON events (city_id, publication_status, start_time, end_time);

-- Fast Slug Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues (slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

-- Banners Active Window Index
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners (city_id, placement, is_active, starts_at, ends_at);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reports ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access for Reference Data
CREATE POLICY "Public can view active cities" ON cities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active neighborhoods" ON neighborhoods
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view venues" ON venues
    FOR SELECT USING (true);

-- 2. Events: Public can only view published events
CREATE POLICY "Public can view published events" ON events
    FOR SELECT USING (publication_status = 'published');

-- Allow community event submission (inserts with pending_review only)
CREATE POLICY "Public can submit pending events" ON events
    FOR INSERT WITH CHECK (publication_status = 'pending_review');

-- 3. Dynamic Banners
CREATE POLICY "Public can view active scheduled banners" ON banners
    FOR SELECT USING (is_active = true AND starts_at <= now() AND ends_at >= now());

-- 4. Favorites: Authenticated users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON favorite_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add own favorites" ON favorite_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" ON favorite_events
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Reports: Public can insert reports, cannot read others' reports
CREATE POLICY "Public can submit reports" ON event_reports
    FOR INSERT WITH CHECK (true);
