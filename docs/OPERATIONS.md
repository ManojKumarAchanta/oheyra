# Oheyra — Operations, Monitoring & Zero-Downtime Runbook

## 1. Daily Health & Liveness Checks

### API Readiness
* **Endpoint:** `GET https://oheyra-api.yourname.workers.dev/health`
* **Expected Response:**
  ```json
  {
    "success": true,
    "data": {
      "status": "healthy",
      "brand": "Oheyra",
      "tagline": "Your city has plans.",
      "service": "oheyra-api",
      "runtime": "cloudflare-workers",
      "timestamp": "2026-10-16T12:00:00.000Z"
    }
  }
  ```

---

## 2. Viewing Real-Time Logs

* **Cloudflare Workers Logs (Frontend & API):**
  1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.
  2. Select `oheyra-web` or `oheyra-api`.
  3. Click **Logs** > **Begin real-time stream**.

---

## 3. Instant Rollbacks

Cloudflare Workers keeps an immutable version history of every deployment:
1. In Cloudflare Dashboard, navigate to **Workers & Pages > [Worker Name] > Deployments**.
2. Click the three dots `...` next to any previously known healthy deployment.
3. Select **Rollback to this version**. The rollback applies globally across all edge nodes in < 5 seconds.
