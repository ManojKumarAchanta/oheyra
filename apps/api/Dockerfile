# Multi-stage production Dockerfile for Koyeb & Container deployment
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.34.5 --activate
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS dependencies
COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/utils/package.json ./packages/utils/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile || pnpm install

# Stage 2: Build packages & API
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/config/node_modules ./packages/config/node_modules
COPY --from=dependencies /app/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=dependencies /app/packages/utils/node_modules ./packages/utils/node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules

COPY pnpm-workspace.yaml package.json tsconfig.json* ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build shared packages first, then API
RUN pnpm --filter @pulse/contracts build && \
    pnpm --filter @pulse/utils build && \
    pnpm --filter @pulse/api build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
COPY packages/config/ ./packages/config/
COPY packages/contracts/ ./packages/contracts/
COPY packages/utils/ ./packages/utils/
COPY apps/api/package.json ./apps/api/

# Install only production dependencies
RUN pnpm install --prod --ignore-scripts

# Copy compiled artifacts from builder
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["node", "apps/api/dist/server.js"]
