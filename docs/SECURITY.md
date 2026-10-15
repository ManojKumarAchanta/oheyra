# Oheyra — Security & Data Protection Specification

## 1. Secrets Separation & Trust Boundaries

* **Browser Environment:** The Next.js frontend has access **only** to variables prefixed with `NEXT_PUBLIC_` (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAP_STYLE_URL`).
* **Server Environment:** Secret credentials such as `SUPABASE_SERVICE_ROLE_KEY` and direct PostgreSQL database credentials exist exclusively as encrypted Cloudflare Worker Secrets. They are **never** bundled or transmitted to the client.

---

## 2. Row Level Security (RLS)

All 8 database tables have Row Level Security explicitly enabled:
* Public read access is strictly filtered: `publication_status = 'published'` on `events`.
* Public submissions are allowed only with `publication_status = 'pending_review'`.
* Users can only inspect, create, or delete favorites matching their authenticated `auth.uid() = user_id`.

---

## 3. Anti-Abuse & Rate Limiting

* **Cloudflare Edge DDoS & WAF Protection:** Both the frontend and API benefit from Cloudflare's unmetered DDoS mitigation.
* **Honeypot Protection:** Public event submission forms contain an invisible `honeypot` field. Automated scrapers and spam bots that populate this field are rejected.
* **Input Validation:** Strict Zod schema validation on both the client and Hono route boundaries.
