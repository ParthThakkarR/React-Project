# ---- Backend Dockerfile ----
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose the API port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
