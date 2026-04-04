# Build stage base
FROM node:24-alpine AS base
LABEL maintainer="charlesdang.252@gmail.com"
WORKDIR /app

# Stage to install all dependencies and build the app
FROM base AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json ./
# No --ignore-scripts here so native modules (bcrypt, etc.) are compiled correctly
RUN set -x && npm ci

COPY . .

RUN npm run db:generate && npm run build

# Main Stage — lean production image
FROM base AS main
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json ./
RUN set -x && npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy only necessary artifacts from builder
COPY --from=builder /app/generated/prisma-client ./generated/prisma-client
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -S ec2-user && adduser -S ec2-user -G ec2-user && \
    chown -R ec2-user:ec2-user /app
USER ec2-user

RUN touch .env
EXPOSE 5300

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5300/api/hello

# Use node directly — avoids npm overhead and handles signals correctly
CMD ["node", "dist/main"]
