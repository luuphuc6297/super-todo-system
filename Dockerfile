# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ gcc sqlite-dev

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install specific version of pnpm
RUN npm install -g pnpm@8.15.4

# Install dependencies with --force to recreate lockfile if needed
RUN pnpm install --frozen-lockfile || pnpm install --force

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ gcc sqlite-dev

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Install specific version of pnpm
RUN npm install -g pnpm@8.15.4
RUN pnpm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Install runtime dependencies and build tools for SQLite3
RUN apk add --no-cache sqlite-dev python3 make g++ gcc

# Set NODE_ENV
ENV NODE_ENV production

# Copy built files and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install specific version of pnpm
RUN npm install -g pnpm@8.15.4

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod --force
RUN cd node_modules/sqlite3 && pnpm rebuild

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Expose port
ENV PORT 8080
EXPOSE 8080

# Start application
CMD ["node", "dist/main"] 