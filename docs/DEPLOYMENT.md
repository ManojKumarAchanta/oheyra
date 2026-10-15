# Oheyra — Deployment & Continuous Delivery Manual

This guide outlines how to deploy Oheyra's frontend and backend independently to **Cloudflare Workers** using continuous delivery with zero planned infrastructure spend.

---

## 1. Cloudflare Credentials Setup (5 Minutes)

1. Sign up for free at [dash.cloudflare.com](https://dash.cloudflare.com) (no credit card required).
2. Go to **My Profile > API Tokens** > Click **Create Token**.
3. Use the template **Edit Cloudflare Workers** (provides Workers, KV, and Pages permissions).
4. Copy the **API Token** and note your **Account ID** (found in your Workers dashboard sidebar).

---

## 2. Configure GitHub Repository Secrets

In your GitHub repository, navigate to **Settings > Secrets and variables > Actions** and add the following repository secrets:

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API Token | `...` |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | `...` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your frontend | `https://oheyra.city` or `https://oheyra-web.yourname.workers.dev` |
| `NEXT_PUBLIC_API_URL` | Your live Cloudflare Worker API URL | `https://oheyra-api.yourname.workers.dev` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public anon key | `ey...` |
| `SUPABASE_URL` | Server-side Supabase URL | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Server-side Supabase anon key | `ey...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase privileged service-role key | `ey...` |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Free CARTO Dark Matter style URL | `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json` |

---

## 3. Deploying Frontend to Cloudflare Workers (Separate CD)

### Automatic / GitHub Actions Deployment
1. Go to **Actions** in your GitHub repository.
2. Select **Deploy Frontend (Cloudflare Workers)**.
3. Click **Run workflow** on `main`.
4. The workflow builds the `@opennextjs/cloudflare` bundle and deploys it directly to Cloudflare Workers!

### Local / Manual Deployment via CLI
```bash
cd apps/web
pnpm run deploy:cf
```

---

## 4. Deploying Backend API to Cloudflare Workers (Separate CD)

### Automatic / GitHub Actions Deployment
1. Go to **Actions** in your GitHub repository.
2. Select **Deploy Backend (Cloudflare Workers)**.
3. Click **Run workflow** on `main`.
4. The workflow builds and deploys the Hono API Worker to Cloudflare!

### Local / Manual Deployment via CLI
```bash
cd apps/api
pnpm run deploy
```

---

## 5. Post-Deployment Verification Checklist

1. **Frontend Availability:**
   - Open your Cloudflare Worker URL in mobile and desktop browsers.
   - Verify that the dark mode UI loads with Oheyra branding ("Your city has plans.").
   - Test the category pills and time filters (`Right Now`, `Tonight`, `This Weekend`).
   - Test generating a branded QR code on `/qr` and downloading the PNG.
2. **Backend Availability:**
   - Test `GET https://oheyra-api.yourname.workers.dev/health` (should return `{ "success": true, "data": { "status": "healthy", "brand": "Oheyra" } }`).
   - Test `GET https://oheyra-api.yourname.workers.dev/api/v1/events` (returns list of events).
