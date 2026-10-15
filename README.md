# PULSE — Real-Time Local Discovery Platform

> **Your City. Your Vibe. Right Now.**  
> A hyper-local activity discovery engine launching in Hyderabad, India. Built for speed, mobile-first responsiveness, and zero planned infrastructure spend.

---

## ⚡ Tech Stack

* **Frontend:** Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, MapLibre GL JS).
* **Backend:** Fastify 5 modular monolith (TypeScript, Zod schemas, structured logging, OpenAPI documentation).
* **Database & Auth:** Supabase PostgreSQL with PostGIS geography extensions and Row Level Security.
* **Hosting:** Cloudflare Workers (Next.js via `@opennextjs/cloudflare`) & Koyeb (Fastify Docker container).
* **Toolchain:** `pnpm` workspaces, Vitest, GitHub Actions CI/CD.

---

## 📁 Repository Structure

```
pulse/
├── apps/
│   ├── web/                     # Next.js 15 App Router frontend
│   └── api/                     # Node.js Fastify API (Modular Monolith)
├── packages/
│   ├── contracts/               # Shared Zod schemas & TypeScript types
│   ├── utils/                   # Spatial math (Haversine) & date-fns formatters
│   └── config/                  # Shared tsconfig base configs
├── supabase/
│   ├── migrations/              # Versioned PostGIS & Postgres SQL migrations
│   └── seed.sql                 # Curated Hyderabad seed data (Jubilee, Banjara, etc.)
├── .github/
│   └── workflows/
│       ├── ci.yml               # Comprehensive lint, typecheck, test, and build CI
│       ├── deploy-frontend.yml  # Independent CD for Cloudflare Workers
│       └── deploy-backend.yml   # Independent CD for Koyeb API
├── docs/                        # Complete architecture, deployment, and runbooks
├── koyeb.yaml                   # Koyeb free container configuration
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
pnpm --filter @pulse/contracts build
pnpm --filter @pulse/utils build
```

### 3. Run Development Servers
```bash
# Starts both Next.js frontend (http://localhost:3000) and Fastify API (http://localhost:3001)
pnpm dev

# Or run them individually:
pnpm dev:web
pnpm dev:api
```

### 4. Interactive API Documentation
Open `http://localhost:3001/docs` to view and test all Fastify REST API endpoints via Swagger UI.

---

## 🧪 Testing & Code Quality

```bash
# Run full unit and integration test suite
pnpm test

# Run strict TypeScript typechecks across all 6 workspace packages
pnpm typecheck

# Build both production artifacts
pnpm build
```

---

## 🚢 Deployment (Plug in Env Vars & Deploy Separately)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions:
1. **Frontend CD:** Trigger `.github/workflows/deploy-frontend.yml` to deploy to Cloudflare Workers.
2. **Backend CD:** Link your repository to Koyeb or trigger `.github/workflows/deploy-backend.yml` to deploy to Koyeb.
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
