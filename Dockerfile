# Stage 1: Build
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy lockfile and package manifest for cached installs
COPY package.json bunfig.toml bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy remaining files
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production Runner
FROM oven/bun:alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets and static server script from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/serve-static.js ./

# Expose port used by serve-static.js
EXPOSE 5173

# Run the Bun static server
CMD ["bun", "serve-static.js"]
