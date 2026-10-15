# PULSE — Database Architecture & Schema Specification

**Database Engine:** PostgreSQL 15+ with PostGIS  
**Managed Provider:** Supabase (Free Tier, 500 MB quota)  
**Spatial Reference System:** WGS 84 (`SRID 4326`)  
**Time Zone Standard:** UTC (`timestamptz`), formatted to `Asia/Kolkata` at presentation layer

---

## 1. Tables & Relationships

```
                     ┌──────────────────┐
                     │      cities      │
                     └─────────┬────────┘
                               │ 1:N
                               ▼
                     ┌──────────────────┐
                     │  neighborhoods   │
                     └─────────┬────────┘
                               │ 1:N
                               ▼
┌──────────────────┐ 1:N     ┌──────────────────┐
│    categories    │◄────────┤      venues      │
└────────┬─────────┘         └────────┬─────────┘
         │ 1:N                        │ 1:N
         │                            │
         └─────────────┬──────────────┘
                       ▼
             ┌──────────────────┐
             │      events      │
             └─────────┬────────┘
                       │ 1:N
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌──────────────────┐        ┌──────────────────┐
│  favorite_events │        │  event_reports   │
└──────────────────┘        └──────────────────┘
```

---

## 2. Spatial Query Mechanics

### Finding Events Within Bounding Box
```sql
SELECT 
    id, title, slug, location, start_time, end_time, price_type, price_inr, cover_image_url
FROM events
WHERE publication_status = 'published'
  AND end_time > timezone('utc', now())
  AND ST_Intersects(
      location, 
      ST_MakeEnvelope($1, $2, $3, $4, 4326)::geography
  )
ORDER BY start_time ASC
LIMIT 30;
```

---

## 3. Migration Commands

To apply the migrations locally or against a Supabase cloud instance:

```bash
# Using Supabase CLI:
supabase db push

# Or directly in Supabase Web Dashboard:
# 1. Open SQL Editor
# 2. Paste supabase/migrations/20261016000001_initial_schema.sql -> Run
# 3. Paste supabase/seed.sql -> Run
```
