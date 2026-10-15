# Oheyra — Local Discovery Platform

> **Your city has plans.**  
> Oheyra helps people discover things to do around them, including local events, cafés, college activities, pop-ups, sports screenings, workshops, and other experiences. Launching in Hyderabad, India.

---

## ⚡ Tech Stack

* **Frontend:** Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, MapLibre GL JS) on **Cloudflare Workers** via `@opennextjs/cloudflare`.
* **Backend:** Hono REST API on **Cloudflare Workers** (V8 edge isolates, sub-ms cold starts, zero Docker).
* **Database & Auth:** Supabase PostgreSQL with PostGIS geography extensions and Row Level Security.
* **Hosting:** 100% Cloudflare Workers (Frontend & API). Zero server maintenance, zero VPS costs.
* **Toolchain:** `pnpm` workspaces, Vitest, GitHub Actions CI/CD.


---

## 📁 Repository Structure

```
oheyra/
├── apps/
│   ├── web/                     # Next.js 15 App Router frontend (Cloudflare Workers)
│   └── api/                     # Hono API on Cloudflare Workers
├── packages/
│   ├── config/                  # Canonical brand configuration (Oheyra)
│   ├── contracts/               # Shared Zod schemas & TypeScript types
│   └── utils/                   # Spatial math (Haversine) & date-fns formatters
├── supabase/
│   ├── migrations/              # Versioned PostGIS & Postgres SQL migrations
│   └── seed.sql                 # Curated Hyderabad seed data (Jubilee, Banjara, etc.)
├── .github/
│   └── workflows/
│       ├── ci.yml               # Comprehensive lint, typecheck, test, and build CI
│       ├── deploy-frontend.yml  # Independent CD for Frontend to Cloudflare Workers
│       └── deploy-backend.yml   # Independent CD for API to Cloudflare Workers
├── docs/                        # Complete architecture, deployment, and runbooks
└── pnpm-workspace.yaml
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build Shared Packages
```bash
pnpm --filter @oheyra/config build
pnpm --filter @oheyra/contracts build
pnpm --filter @oheyra/utils build
```

### 3. Run Development Servers
```bash
# Starts both Next.js frontend (http://localhost:3000) and API (http://localhost:3001)
pnpm dev

# Or run them individually:
pnpm dev:web
pnpm dev:api
```

---

## 🧪 Testing & Code Quality

```bash
# Run full unit and integration test suite
pnpm test

# Run strict TypeScript typechecks across all 5 workspace packages
pnpm typecheck

# Build both production artifacts
pnpm build
```

---

## 🚢 Deployment (Plug in Env Vars & Deploy Separately)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions:
1. **Frontend CD:** Trigger `.github/workflows/deploy-frontend.yml` to deploy to Cloudflare Workers (`oheyra-web`).
2. **Backend CD:** Trigger `.github/workflows/deploy-backend.yml` to deploy to Cloudflare Workers (`oheyra-api`).
3. **Database:** Run `supabase/migrations/20261016000001_initial_schema.sql` and `supabase/seed.sql` in your Supabase SQL Editor.

---

## 📚 Documentation Reference

* [System Architecture](docs/ARCHITECTURE.md)
* [Step-by-Step Deployment Guide](docs/DEPLOYMENT.md)
* [Operating Costs & Free-Tier Limits](docs/COSTS.md)
* [Database & PostGIS Schema](docs/DATABASE.md)
* [Environment Variables Reference](docs/ENVIRONMENT.md)
* [Security & RLS Specifications](docs/SECURITY.md)
* [Operations & Monitoring Runbook](docs/OPERATIONS.md)
* [CI/CD Pipelines](docs/CI_CD.md)
