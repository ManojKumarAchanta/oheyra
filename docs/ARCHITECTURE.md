# PULSE — System Architecture & Design Specification

## 1. High-Level Topology

PULSE is a real-time hyper-local activity and event discovery platform designed for Hyderabad, India. The system is engineered as a lean, low-overhead modular monolith deployed across zero-spend, high-performance edge infrastructure.

```
                              [ Consumer Browsers / Mobile PWAs ]
                                              │
                       ┌──────────────────────┴──────────────────────┐
                       │                                             │
               (HTTPS Page Requests)                         (Direct Asset Hits)
                       ▼                                             ▼
        [ Cloudflare Workers & Global CDN ]                   [ Cloudflare Edge ]
        - Next.js 15 App Router (@opennextjs/cf)             - Cached vector tiles
        - Server-Side Rendering (SSR) & ISR                  - Optimized WebP images
        - Schema.org JSON-LD structured data                 - Static CSS / JS bundles
                       │
                       │ (JSON API Calls via fetch / contracts)
                       ▼
             [ Koyeb Free Web Service ]
             - Node.js 20 LTS (Fastify 5 Modular Monolith)
             - Zod runtime validation & schema serialization
             - In-memory rate limiting & security headers
             - Kept alive via zero-cost cron health pings
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

* `apps/web`: Next.js 15 App Router with Tailwind CSS, MapLibre GL JS, and Lucide icons.
* `apps/api`: Fastify modular monolith (REST API under `/api/v1`).
* `packages/contracts`: Single source of truth for Zod schemas, TypeScript types, and API response envelopes.
* `packages/utils`: Shared pure functions (Haversine formula, IST date-fns formatters, URL slugifiers).
* `packages/config`: Centralized TypeScript and base compiler options.
* `supabase/migrations`: Version-controlled SQL migrations enabling PostGIS, schema definitions, and RLS policies.
* `supabase/seed.sql`: Realistic, verified Hyderabad seed data across 4 core hubs (Jubilee Hills, Banjara Hills, Gachibowli, Old City).

---

## 3. Spatial & Ephemeral Discovery Engine

1. **Bounding-Box Queries (`bbox`):**  
   The frontend translates the interactive MapLibre viewport into `minLng,minLat,maxLng,maxLat` and requests events in the visible viewport with a 350ms debounce.
2. **PostGIS GiST Indexing:**  
   `CREATE INDEX idx_events_location ON events USING GIST(location);` enables sub-10ms spatial filtering.
3. **Time-Sensitive Filter Pipelines:**
   * **Right Now:** Events actively happening or starting within the next 3 hours.
   * **Tonight:** Events running between 6:00 PM and 4:00 AM IST.
   * **This Weekend:** Events between Friday 5:00 PM and Sunday midnight IST.
4. **Resilient Client-Side Fallback:**  
   If the remote backend is in a cold-start state or offline, the frontend's API client gracefully falls back to local curated seed data so users never experience a blank white screen or 500 error.
