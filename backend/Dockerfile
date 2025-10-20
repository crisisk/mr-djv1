FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./

# Install curl for container health checks
RUN apk add --no-cache curl \
    && npm install --production

# Copy application code
COPY . .

# Create non-root user (use different UID to avoid conflicts)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "src/server.js"]

