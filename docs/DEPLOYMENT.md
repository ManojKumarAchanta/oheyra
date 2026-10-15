# PULSE — Deployment & Continuous Delivery Manual

This guide outlines how to deploy PULSE's frontend and backend independently using continuous delivery with zero planned infrastructure spend.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │          GitHub Repository           │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │ .github/workflows/        │                   │ .github/workflows/        │
   │ deploy-frontend.yml       │                   │ deploy-backend.yml        │
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │ (Triggers on apps/web changes)                │ (Triggers on apps/api changes)
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Cloudflare Workers     │                   │       Koyeb Free          │
   │    (@opennextjs/cf)       │                   │      (Fastify API)        │
   │    https://pulse.city     │                   │  https://...koyeb.app     │
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                           ┌───────────────────────────┐
                           │   Supabase Free Project   │
                           │   (Postgres, Auth, RLS)   │
                           └───────────────────────────┘
```

---

## 1. Supabase Setup (5 Minutes)

1. Go to [database.new](https://database.new) and create a free project.
2. Select region closest to India (e.g. `ap-south-1` Mumbai or `ap-southeast-1` Singapore).
3. In the left navigation, go to **SQL Editor**.
4. Open [supabase/migrations/20261016000001_initial_schema.sql](../supabase/migrations/20261016000001_initial_schema.sql), paste its contents, and click **Run**.
5. Open [supabase/seed.sql](../supabase/seed.sql), paste its contents, and click **Run**.
6. In **Project Settings > API**, note down:
   - Project URL (e.g. `https://xxxx.supabase.co`)
   - `anon` `public` key
   - `service_role` `secret` key

---

## 2. Deploying Backend API to Koyeb (Separate CD)

### Option A: Automatic Git Deployment via Koyeb Web Dashboard (Recommended)
1. Sign up for free at [koyeb.com](https://www.koyeb.com) (no credit card required).
2. Click **Create Service** > Select **GitHub**.
3. Choose your repository.
4. Builder: Select **Dockerfile** and set Dockerfile path to: `apps/api/Dockerfile`.
5. Instance size: Select **Nano** (Free tier, 512MB RAM, 0.1 vCPU).
6. Region: **Frankfurt** (`fra`).
7. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `8000`
   - `HOST`: `0.0.0.0`
   - `LOG_LEVEL`: `info`
   - `WEB_ORIGIN`: `https://your-frontend.workers.dev` (or custom domain)
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-supabase-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-supabase-service-role-key`
8. Click **Deploy**. Koyeb will build the multi-stage Docker container and give you a public URL (e.g., `https://pulse-api-yourname.koyeb.app`).
9. Verify by opening `https://pulse-api-yourname.koyeb.app/health` in your browser.

### Option B: Triggering via GitHub Actions Workflow
1. Go to **Koyeb Account Settings > API** and generate an API Token.
2. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
3. Add a secret named `KOYEB_API_TOKEN`.
4. Now, any push touching `apps/api/**` or manually triggering the **Deploy Backend (Koyeb)** workflow in the GitHub Actions tab will automatically redeploy the backend!

---

## 3. Deploying Frontend to Cloudflare Workers (Separate CD)

### Step 1: Cloudflare Credentials
1. Sign up for free at [dash.cloudflare.com](https://dash.cloudflare.com) (no credit card required).
2. Go to **My Profile > API Tokens** > Click **Create Token**.
3. Use the template **Edit Cloudflare Workers** (provides Workers, KV, and Pages permissions).
4. Copy the **API Token** and note your **Account ID** (found in your Workers & Pages dashboard sidebar).

### Step 2: Configure GitHub Repository Secrets
In GitHub **Settings > Secrets and variables > Actions**, add the following repository secrets:

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API Token | `...` |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | `...` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your frontend | `https://pulse.city` or `https://pulse-web.yourname.workers.dev` |
| `NEXT_PUBLIC_API_URL` | Your live Koyeb API URL | `https://pulse-api-yourname.koyeb.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public anon key | `ey...` |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Free CARTO Dark Matter style URL | `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json` |

### Step 3: Trigger Deployment
1. Go to **Actions** in your GitHub repository.
2. Select **Deploy Frontend (Cloudflare Workers)**.
3. Click **Run workflow** on `main`.
4. The workflow builds the Next.js App Router bundle using `@opennextjs/cloudflare` and deploys it directly to Cloudflare Workers!

---

## 4. Post-Deployment Verification Checklist

1. **Frontend Availability:**
   - Open your Cloudflare Worker URL in mobile and desktop browsers.
   - Verify that the dark mode UI loads with the Hyderabad event feed.
   - Test the category pills and time filters (`Right Now`, `Tonight`, `This Weekend`).
   - Test generating a branded QR code on `/qr` and downloading the PNG.
2. **Backend Availability:**
   - Test `GET https://your-koyeb-url/health` (should return `{ "success": true, "data": { "status": "healthy" } }`).
   - Test `GET https://your-koyeb-url/api/v1/events` (should return list of events).
   - Test `GET https://your-koyeb-url/docs` (interactive Swagger UI).
3. **CORS Verification:**
   - Ensure the Fastify API responds to requests initiated by your Cloudflare Worker origin.
