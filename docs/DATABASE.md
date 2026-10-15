# Oheyra — Database Architecture & Schema Specification

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

## 2. Migration Commands

To apply the migrations against your Supabase instance:

```bash
# 1. Open Supabase Dashboard > SQL Editor
# 2. Paste supabase/migrations/20261016000001_initial_schema.sql -> Run
# 3. Paste supabase/seed.sql -> Run
```
