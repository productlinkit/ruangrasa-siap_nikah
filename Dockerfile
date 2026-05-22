# Use Bun image for both build and runtime
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy lockfile and package manifest for cached installs
COPY package.json bunfig.toml bun.lockb ./

# Copy remaining files
COPY . .

# Install dependencies and build using Bun
RUN bun install
RUN bun run build

FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app from builder
COPY --from=builder /app .

# Expose port and run a small Bun static server that serves the built bundle
EXPOSE 5173
CMD ["bun", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
