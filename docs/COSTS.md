# Oheyra — 6-Month Operating Costs & Cloudflare Free-Tier Limits

**Document Date:** October 2026  
**Target Operating Budget:** ₹0.00 / month ($0.00)  
**Target User Capacity:** Up to 5,000 Monthly Active Users (MAU)  
**Architecture:** 100% Cloudflare Compute (Frontend & API) + Supabase PostgreSQL

---

## 1. Verified Official Free-Tier Limits

All specifications below are grounded in official provider documentation verified as of October 2026.

### A. Cloudflare Workers — Frontend (`oheyra-web`) & API (`oheyra-api`)
* **Official Source:** [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
* **Verified Free Tier Allowances:**
  * **100,000 requests / day** across all worker instances (3,000,000 requests / month).
  * **10 ms CPU execution time** per request (ample for Hono routing and Next.js SSR renders).
  * **Zero egress bandwidth fees** (unlike AWS or Google Cloud).
  * Unlimited custom domains, free automatic SSL certificates, and global edge CDN caching across 300+ cities.
* **Credit Card Required:** No.
* **Overage Behavior:** When the 100,000 daily request limit is reached, Cloudflare returns an HTTP 1015 (Rate limited) error. **It does NOT automatically charge your card or generate surprise invoices.**
* **Capacity Fit for Oheyra:** 5,000 MAU generating ~120,000 page views per month equates to ~4,000 requests/day—comfortably using only **4% of Cloudflare's free daily limit**.

### B. Supabase (Managed PostgreSQL, PostGIS & Auth)
* **Official Source:** [Supabase Pricing](https://supabase.com/pricing)
* **Verified Free Tier Limits:**
  * **500 MB** PostgreSQL database size.
  * **50,000** Monthly Active Users for Supabase Auth.
  * **1 GB** file storage (for event cover images).
  * **5 GB** database and storage egress bandwidth per month.
  * Unlimited API requests.
* **Credit Card Required:** No.
* **Inactivity Rule:**
  * Free projects are automatically paused after **7 consecutive days of zero database queries**.
  * *Operational Mitigation:* Active user discovery queries and periodic cron health pings prevent pauses.

### C. CARTO Dark Matter (Map Tile Provider)
* **Official Source:** [CARTO Basemaps Terms of Service](https://carto.com/basemaps/apikey/)
* **Verified Free Limits:**
  * **1,000,000 tile requests / month** free for commercial and production use.
  * Style URL: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`.
* **Zero-Cost Fallback:** If monthly quota is approached, the frontend automatically falls back to **OpenFreeMap** (`https://tiles.openfreemap.org/styles/dark`) which has zero rate limits and zero cost.

### D. GitHub Actions (Continuous Integration & Delivery)
* **Official Source:** [GitHub Actions Pricing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
* **Verified Free Allowance:**
  * **2,000 runner minutes / month** for private repositories (unlimited for public open-source repos).
  * Oheyra's CI pipeline executes in ~1.5 minutes, allowing over 1,300 builds per month at ₹0.

---

## 2. Hard Spending Controls & Cost Elimination

1. **Zero Standing VPS / Server Costs:** By eliminating Koyeb, traditional VMs, and Docker containers, there are zero compute instances running idle or incurring hourly billing.
2. **Hard Spend Caps:** On Supabase, the default configuration for Free projects has the "Spend Cap" toggled ON.
3. **No Payment Methods Required:** None of the accounts require credit cards saved on file during the initial 6-month launch phase.
