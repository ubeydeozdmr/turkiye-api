# deps
FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

# runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8181
# necessary for some packages
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
# If data is outside src:
# COPY data ./data

# non-root
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs \
  && chown -R nodeuser:nodejs /app
RUN apk add --no-cache curl
USER nodeuser

EXPOSE 8181
# If there is health endpoint (örn. /health):
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8181/health || exit 1

CMD ["node", "src/index.js"]
