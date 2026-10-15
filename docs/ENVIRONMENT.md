# Oheyra — Environment Variables & Secrets Reference

This document catalogs every environment variable across the frontend and backend services.

---

## 1. Frontend (`apps/web` on Cloudflare Workers)

Configure these in `apps/web/.env.local` for local development or in GitHub Secrets / Cloudflare Dashboard for production:

| Variable | Required | Scope | Description |
| :--- | :---: | :---: | :--- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public | Canonical URL of the platform (e.g., `https://oheyra.city`). |
| `NEXT_PUBLIC_API_URL` | Yes | Public | Base URL of the API Worker (e.g., `https://oheyra-api.yourname.workers.dev`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public | Supabase project URL (e.g., `https://xxxx.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public | Supabase public anonymous API key. |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Optional | Public | MapLibre tile style URL (defaults to CARTO Dark Matter). |

---

## 2. Backend API (`apps/api` on Cloudflare Workers)

Configure these in `apps/api/.dev.vars` for local development or in Cloudflare Dashboard Variables / GitHub Secrets:

| Variable | Required | Scope | Description |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | Yes | Server | Runtime environment (`development`, `test`, or `production`). |
| `WEB_ORIGIN` | Yes | Server | Allowed CORS origin (e.g., `https://oheyra.city`). |
| `SUPABASE_URL` | Yes | Server | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Yes | Server | Supabase public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Secret | Supabase privileged service-role key. |
| `SUPABASE_DB_URL` | Optional | Secret | Direct PostgreSQL connection string for database migrations. |
