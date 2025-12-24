
# -------- deps --------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# -------- build --------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client for alpine (musl + openssl3)
# Requires schema.prisma generator binaryTargets to include linux-musl-openssl-3.0.x
RUN npx prisma generate
RUN npm run build

# -------- runtime --------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# minimal hardening
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# IMPORTANT: include Next config in runtime
COPY --from=builder /app/next.config.* ./

RUN mkdir -p /app/.next/cache \
  && chown -R nextjs:nodejs /app/.next

# entrypoint runs migrations then starts server
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
USER nextjs
ENTRYPOINT ["/entrypoint.sh"]

