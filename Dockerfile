# Use Bun image for both build and runtime
FROM node:24-alpine AS builder
WORKDIR /app

# Copy lockfile and package manifest for cached installs
COPY package.json bunfig.toml bun.lockb ./

# Copy remaining files
COPY . .

# Install dependencies and build
RUN npm install --legacy-peer-deps
RUN npm run build

FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app from builder
COPY --from=builder /app .

# Vite preview default port is 5173; bind to all interfaces
EXPOSE 5173
CMD ["bun", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
