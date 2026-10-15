# PULSE — 6-Month Operating Costs, Free-Tier Limits & Hard Spend Controls

**Document Date:** October 2026  
**Target Operating Budget:** ₹0.00 / month ($0.00)  
**Target User Capacity:** Up to 5,000 Monthly Active Users (MAU)

---

## 1. Official Free-Tier Verification & Limits

All specifications below are grounded in official provider documentation verified as of October 2026.

### A. Cloudflare Workers (Next.js Frontend Hosting)
* **Official Source:** [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
* **Verified Free Allowance:**
  * **100,000 requests / day** (3,000,000 requests / month).
  * **10 ms CPU time** per execution.
  * **Zero bandwidth / egress charges**.
  * Free SSL certificates, unlimited preview deployments, and global edge CDN caching.
* **Credit Card Required:** No.
* **Overage Behavior:** When the 100,000 daily request limit is reached, Cloudflare returns an HTTP 1015 (Rate limited) error. **It does NOT automatically charge your card or generate surprise invoices.**
* **Capacity Fit for PULSE:** 5,000 MAU generating ~120,000 page views per month equates to ~4,000 requests/day—comfortably using only **4% of Cloudflare's free daily limit**.

### B. Koyeb Free Instance (Fastify Backend API)
* **Official Source:** [Koyeb Pricing Documentation](https://www.koyeb.com/pricing)
* **Verified Free Specs:**
  * **1 Free Nano Instance:** 512 MB RAM, 0.1 vCPU, 2 GB SSD.
  * **100 GB / month** outbound data transfer.
  * Available in Frankfurt (Germany) and Washington D.C. (USA).
* **Credit Card Required:** No (free account sign-up via GitHub/Google authentication).
* **Inactivity / Sleeping Behavior:**
  * Free instances sleep after ~1 hour of zero incoming HTTP traffic (scale-to-zero).
  * Cold start latency is ~15-20s.
  * *Operational Mitigation:* A free UptimeRobot or Cron-Job ping hitting `GET /api/v1/health` every 15 minutes completely prevents sleep for ₹0.
* **Overage Behavior:** Koyeb stops execution if resources or limits are breached; zero automatic credit card overage charges.

### C. Supabase (Managed PostgreSQL & Auth)
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
  * *Operational Mitigation:* Regular production user discovery queries and periodic cron pings ensure the database remains continuously active.
* **Capacity Fit for PULSE:**
  * 1,000 events + 100 venues + 20 categories consume approximately **12 MB** out of the 500 MB limit (97.6% remaining).
  * 500 WebP images @ 80KB each consume **40 MB** out of 1 GB storage (96% remaining).

### D. CARTO Dark Matter (Map Tile Provider)
* **Official Source:** [CARTO Basemaps Terms of Service](https://carto.com/basemaps/apikey/)
* **Verified Free Limits:**
  * **1,000,000 tile requests / month** free for commercial and production use.
  * Style URL: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json?key=FREE_KEY`.
* **Zero-Cost Fallback:** If monthly quota is approached, the frontend automatically falls back to **OpenFreeMap** (`https://tiles.openfreemap.org/styles/dark`) which has zero rate limits and zero cost.

### E. GitHub Actions (Continuous Integration & Delivery)
* **Official Source:** [GitHub Actions Pricing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
* **Verified Free Allowance:**
  * **2,000 runner minutes / month** for private repositories (unlimited for public open-source repos).
  * PULSE's CI pipeline executes in ~1.5 minutes, allowing over 1,300 builds per month at ₹0.

---

## 2. Hard Spending Controls & Shutdown Plan

1. **No Payment Methods Attached:** None of the accounts require or should have credit cards saved on file during the initial 6-month launch phase. This physically eliminates accidental billing.
2. **Provider Spend Caps:** On Supabase, the default configuration for Free projects has the "Spend Cap" toggled ON.
3. **Emergency Degradation / Shutdown:**
   * If Koyeb experiences an outage or suspension: The Next.js frontend on Cloudflare continues serving cached pages, and the UI gracefully displays cached seed data with a "Live updates temporarily delayed" indicator.
   * If Supabase pauses due to unexpected inactivity: Run `pg_dump` backup restoration or simply click "Restore project" in the Supabase web dashboard.
