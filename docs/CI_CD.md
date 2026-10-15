# Oheyra — CI/CD Pipeline Documentation

Oheyra uses GitHub Actions with three distinct, non-interfering workflows:

```
┌─────────────────────────────────┐
│     .github/workflows/ci.yml    │ (Runs on every PR and push to main)
│     - TypeScript Checks         │
│     - Unit & Integration Tests  │
│     - Workers API Build Check   │
│     - Next.js Build Validation  │
└─────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  .github/workflows/deploy-frontend.yml       │ (Independent CD for Next.js to Cloudflare)
│  - Trigger: Push to apps/web/** or Manual    │
│  - Builds @opennextjs/cloudflare bundle      │
│  - Deploys via Wrangler to Cloudflare Worker │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  .github/workflows/deploy-backend.yml        │ (Independent CD for Hono API to Cloudflare)
│  - Trigger: Push to apps/api/** or Manual    │
│  - Deploys via Wrangler to Cloudflare Worker │
└──────────────────────────────────────────────┘
```

---

## 1. Quality Gate: `ci.yml`

* **Triggers:** Pull requests to `main` and pushes to `main`.
* **Execution:**
  1. Checks out repository and configures Node.js 20 LTS and pnpm 10.
  2. Runs `pnpm install --frozen-lockfile`.
  3. Builds shared packages (`@oheyra/config`, `@oheyra/contracts`, and `@oheyra/utils`).
  4. Runs workspace typecheck (`pnpm typecheck`).
  5. Executes unit and integration test suites via Vitest.
  6. Validates production compilation of `@oheyra/api` and `@oheyra/web`.

---

## 2. Separate Deployment Triggering

To deploy either service independently without touching the other:
1. **Frontend:** Navigate to **Actions > Deploy Frontend (Cloudflare Workers) > Run workflow**.
2. **Backend:** Navigate to **Actions > Deploy Backend (Cloudflare Workers) > Run workflow**.
