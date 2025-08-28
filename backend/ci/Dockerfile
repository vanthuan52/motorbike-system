# Build stage for compiling the application
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with clear logging and no user interaction
RUN npm ci

# Install only for building nestjs, nextjs
RUN npm install -D @swc/cli @swc/core

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Production stage with minimal footprint
FROM node:lts-alpine AS main

LABEL maintainer="charlesdang.252@gmail.com"

# Create non-root user for security
RUN addgroup -S ec2-user && adduser -S ec2-user -G ec2-user

ENV NODE_ENV=production

# Set working directory and expose API port
WORKDIR /app
EXPOSE 5300

# Copy only necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Set ownership to non-root user
RUN chown -R ec2-user:ec2-user /app
USER ec2-user

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
