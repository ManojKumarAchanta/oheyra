# Oheyra — System Architecture & Design Specification

## 1. High-Level Topology

Oheyra is a real-time hyper-local activity and event discovery platform designed for Hyderabad, India, and engineered for scalable expansion city-by-city.

```
                              [ Consumer Browsers / Mobile PWAs ]
                                              │
                       ┌──────────────────────┴──────────────────────┐
                       │                                             │
               (HTTPS Page Requests)                         (Direct Asset Hits)
                       ▼                                             ▼
        [ Cloudflare Workers — Frontend ]                     [ Cloudflare Edge CDN ]
        - Next.js 15 App Router (@opennextjs/cf)             - Cached vector basemap tiles
        - Server-Side Rendering (SSR) & Static Prerender     - Optimized WebP images
        - Schema.org JSON-LD structured data                 - Static CSS & JS bundles
                       │
                       │ (JSON API Calls via fetch / contracts)
                       ▼
        [ Cloudflare Workers — API ]
        - Hono v4 Edge Router on V8 Isolates
        - Sub-millisecond cold starts, zero Docker containers
        - Zod runtime schema validation
        - Zero egress fees
                       │
                       │ (PostGIS Geography Queries & Supabase Auth)
                       ▼
             [ Supabase PostgreSQL & PostGIS ]
             - Spatial GiST indexes for sub-10ms bounding-box queries
             - Row Level Security (RLS) for public reads & user favorites
             - Automatic timestamp & publication status constraints
```

---

## 2. Core Monorepo Design & Dependency Boundaries

The codebase is organized as a strict `pnpm` monorepo:

* `apps/web`: Next.js 15 App Router with Tailwind CSS, MapLibre GL JS, and Lucide icons deployed via `@opennextjs/cloudflare`.
* `apps/api`: High-performance Hono REST API deployed natively to Cloudflare Workers.
* `packages/config`: Canonical brand configuration (`brand.name = 'Oheyra'`, `brand.tagline = 'Your city has plans.'`).
* `packages/contracts`: Single source of truth for Zod schemas, TypeScript types, and API response envelopes.
* `packages/utils`: Shared pure functions (Haversine formula, IST date-fns formatters, URL slugifiers).
* `supabase/migrations`: Version-controlled SQL migrations enabling PostGIS, schema definitions, and RLS policies.
* `supabase/seed.sql`: Curated Hyderabad seed data across Jubilee Hills, Banjara Hills, Gachibowli, and Old City.
