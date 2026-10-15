# PULSE — Operations, Monitoring & Zero-Downtime Runbook

## 1. Daily Health & Liveness Checks

### API Readiness
* **Endpoint:** `GET https://pulse-api-yourname.koyeb.app/health`
* **Expected Response:**
  ```json
  {
    "success": true,
    "data": {
      "status": "healthy",
      "service": "pulse-api",
      "uptimeSeconds": 86400,
      "timestamp": "2026-10-16T12:00:00.000Z"
    }
  }
  ```

### Free Uptime Keep-Alive Strategy
To prevent Koyeb's free Nano instance from sleeping after 1 hour of zero traffic:
1. Create a free account at [UptimeRobot](https://uptimerobot.com) or [Cron-Job.org](https://cron-job.org).
2. Create an HTTP monitor pointing to `https://pulse-api-yourname.koyeb.app/health`.
3. Set the polling interval to **every 10 or 15 minutes**.
4. This keeps the Fastify container permanently warm with **0s cold start** at ₹0 cost.

---

## 2. Viewing Real-Time Logs

* **Koyeb API Logs:**
  1. Open the [Koyeb Console](https://app.koyeb.com).
  2. Select your `pulse-api` service.
  3. Click on the **Runtime Logs** tab. Structured Pino JSON logs will stream in real time.
* **Cloudflare Workers Logs:**
  1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.
  2. Select `pulse-web` > Click **Logs** > **Begin real-time stream**.

---

## 3. Disaster Recovery & Rollback

### Cloudflare Frontend Rollback
Cloudflare Workers keeps an immutable version history of every deployment:
1. In Cloudflare Dashboard, navigate to **Workers & Pages > pulse-web > Deployments**.
2. Click the three dots `...` next to any previously known healthy deployment.
3. Select **Rollback to this version**. The rollback applies globally across all edge nodes in < 5 seconds.

### Koyeb API Rollback
1. In the Koyeb Console, go to **Deployments**.
2. Select the previous green deployment and click **Redeploy**.
