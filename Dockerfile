# ========================================================
# CHATNCOLLAB Production Multi-Stage Dockerfile
# ========================================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy compiled frontend from builder
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

WORKDIR /app/backend
CMD ["node", "server.js"]
