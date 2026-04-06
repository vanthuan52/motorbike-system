# Motorbike System — Backend 🏍️ 🔥

Production-ready NestJS backend for a **motorbike service and care management platform**. Built with enterprise-grade authentication, RBAC authorization, S3-compatible file storage (MinIO/AWS), real-time chat, appointment management, and full vehicle care record tracking.

> Built on top of [ACK NestJS Boilerplate][ref-ack] — a battle-tested NestJS foundation.

## Table of Contents

- [Important](#important)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Domain Modules](#domain-modules)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [License](#license)
- [Contact](#contact)

---

## Important

- **Stateful Authorization** using `Redis` sessions and `JWT` (ES256 Access + ES512 Refresh).
- **MongoDB Replica Set** is required by Prisma for transaction support.
- Set `NODE_ENV=production` to disable Swagger documentation.
- **Decorator order matters** when combining multiple guards on an endpoint:

  ```typescript
  @ExampleDoc()
  @ActivityLog(...)
  @PolicyAbilityProtected({...})
  @RoleProtected(...)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Get('/some-endpoint')
  ```

- Storage is **MinIO by default** (S3-compatible). Switch to AWS S3 by clearing `STORAGE_ENDPOINT` — no code changes needed.
- Package manager: **npm** (do not use pnpm or yarn).

---

## Tech Stack

| Technology     | Version       |
| -------------- | ------------- |
| NestJs         | v11.x         |
| Node.js        | v22.x+        |
| TypeScript     | v6.x          |
| Prisma         | v7.x          |
| MongoDB        | v8.0.x        |
| Redis          | v8.0.x        |
| MinIO          | RELEASE.2025+ |
| Docker         | v24.x+        |
| Docker Compose | v2.x+         |

---

## Architecture

```
src/
├── app/                  # Application bootstrap, guards, interceptors
├── configs/              # Environment configuration (JWT, AWS, Redis, DB...)
├── common/               # Shared infrastructure
│   ├── aws/             # S3 service (MinIO/AWS)
│   ├── cache/           # Redis cache service
│   ├── database/        # Prisma client + database service
│   ├── file/            # File utilities (MIME, extension)
│   ├── firebase/        # Firebase Admin SDK
│   ├── pagination/      # Cursor & offset pagination
│   ├── redis/           # Redis client
│   ├── request/         # Request helpers, CORS, helpers
│   └── response/        # Standardized API response format
├── modules/             # Feature modules (domain logic)
├── queues/              # BullMQ background job processors
├── router/              # Route registration
├── migration/           # Database seeders
├── languages/           # i18n translation files
├── main.ts              # App entry point
└── swagger.ts           # OpenAPI configuration
```

**Design Patterns:**

- **Repository Pattern** — data access layer separated from business logic
- **SOLID Principles** — maintainable and testable codebase
- **12-Factor App** — environment-based configuration, stateless processes
- **Modular Structure** — each domain is a self-contained NestJS module

---

## Features

### 🔐 Authentication & Security

- **JWT with JWKS** — ES256 Access Token, ES512 Refresh Token served via nginx JWKS server
- **Stateful Sessions** — Redis-backed sessions with per-device token revocation
- **Social Login** — Google OAuth 2.0, Apple Sign In
- **RBAC & Policies** — Role + permission system with CASL ability checks
- **API Key Protection** — Secure external API access
- **Rate Limiting** — Configurable throttling per route
- **Security Headers** — Helmet middleware

### 📊 Database & Storage

- **Prisma ORM** — Type-safe MongoDB queries, schema-first approach
- **MongoDB Replica Set** — Required for Prisma transaction support
- **MinIO / AWS S3** — S3-compatible file storage; switch providers via `.env` only
- **Presigned URLs** — Direct client-to-storage upload/download
- **Multipart Upload** — Large file chunked upload support

### ⚡ Performance

- **SWC Compiler** — ~20x faster TypeScript compilation
- **BullMQ Queues** — Async background job processing (email, push, sync)
- **Redis Caching** — Multi-level caching with TTL management
- **Response Compression** — gzip/deflate for all responses
- **Feature Flags** — Dynamic feature rollout without redeployment

### 📡 Integrations

- **AWS SES** — Transactional email with Handlebars templates
- **Firebase FCM** — Push notifications with multicast + token cleanup
- **Sentry** — Error tracking and performance monitoring
- **GeoIP** — Device geolocation with `geoip-lite`
- **WebSockets** — Real-time chat via Socket.IO

### 🛠 Developer Experience

- **Swagger / OpenAPI 3** — Interactive API docs at `/api/docs`
- **URL Versioning** — Default v1 (`/api/v1/...`)
- **i18n** — Multi-language via `x-custom-lang` header
- **Husky + lint-staged** — Pre-commit code quality gates
- **Commander-based seeder** — Role, user, feature flags, API key seeders

---

## Domain Modules

### 🔑 Identity & Access

| Module         | Description                                               |
| -------------- | --------------------------------------------------------- |
| `auth`         | Login, register, refresh token, logout, social login, 2FA |
| `user`         | User CRUD, profile, password management                   |
| `role`         | Role definitions and assignment                           |
| `permission`   | Fine-grained action/subject permissions                   |
| `policy`       | CASL policy management                                    |
| `api-key`      | External API key issuance and validation                  |
| `session`      | Active session listing and revocation                     |
| `device`       | Device ownership and tracking                             |
| `verification` | Email OTP verification flow                               |

### 🏍️ Vehicle & Service Domain

| Module              | Description                                   |
| ------------------- | --------------------------------------------- |
| `vehicle-brand`     | Motorbike brands (Honda, Yamaha...)           |
| `vehicle-model`     | Specific models per brand with specs          |
| `user-vehicle`      | Vehicle ownership registration                |
| `vehicle-service`   | Service types offered (oil change, brakes...) |
| `service-category`  | Service groupings                             |
| `service-price`     | Model-specific pricing per service            |
| `service-checklist` | Inspection checklist items per service        |
| `care-area`         | Inspection zones (engine, chassis, brakes...) |
| `part`              | Spare part catalog                            |
| `part-type`         | Part categorization                           |

### 🔧 Care Records

| Module                  | Description                            |
| ----------------------- | -------------------------------------- |
| `appointment`           | Customer booking and scheduling        |
| `store`                 | Service center / shop management       |
| `care-record`           | Main service record per vehicle visit  |
| `care-record-item`      | Labor and parts used in each record    |
| `care-record-service`   | Services performed during the visit    |
| `care-record-checklist` | Inspection results per checklist item  |
| `care-record-condition` | Initial vehicle condition on arrival   |
| `care-record-media`     | Before/after photos linked to a record |

### 🔔 Communication

| Module         | Description                                |
| -------------- | ------------------------------------------ |
| `notification` | Multi-channel: email, push, in-app, silent |
| `chat`         | Real-time WebSocket chat                   |

### 🛠 Platform

| Module         | Description                                    |
| -------------- | ---------------------------------------------- |
| `media`        | File metadata tracking (S3 key, CDN URL, MIME) |
| `activity-log` | Audit trail for user actions                   |
| `health`       | System health check endpoint                   |
| `job`          | Background job management                      |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/vanthuan52/motorbike_system.git
cd motorbike_system/backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.development
# Edit .env.development and fill in required values

# 4. Generate JWT keys
npm run generate:keys

# 5. Start all supporting services (MongoDB, Redis, MinIO, JWKS)
docker compose -f docker-compose.dev.yml --env-file .env.development up -d

# 6. Setup database
npm run db:generate
npm run db:migrate
npm run migration:seed

# 7. Start the app
npm run start:dev
```

**API:** `http://localhost:5300`
**Swagger:** `http://localhost:5300/api/docs`
**MinIO Console:** `http://localhost:39001`
**Bull Board:** `http://localhost:5303`

> See [setup.md](./setup.md) for the full step-by-step installation guide.

---

## Installation

| Environment | Command                                              | Notes                       |
| ----------- | ---------------------------------------------------- | --------------------------- |
| Development | `npm run start:dev`                                  | Hot-reload, Swagger enabled |
| Staging     | `docker compose -f docker-compose.staging.yml up -d` | Full stack in Docker        |
| Production  | `npm run build && npm run start:prod`                | Swagger disabled            |

### Key npm Scripts

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `npm run start:dev`       | Start with hot-reload     |
| `npm run db:generate`     | Regenerate Prisma client  |
| `npm run db:migrate`      | Push schema to MongoDB    |
| `npm run db:studio`       | Open Prisma Studio        |
| `npm run migration:seed`  | Seed initial data         |
| `npm run migration:fresh` | Reset DB and re-seed      |
| `npm run generate:keys`   | Generate new JWT key pair |
| `npm run test`            | Run unit tests            |
| `npm run lint`            | Run ESLint                |
| `npm run format`          | Run Prettier              |
| `npm run typecheck`       | Run TypeScript type check |

---

## Storage — MinIO / AWS S3

Storage is config-driven. **No code change needed** to switch providers:

```env
# MinIO (default for local/staging)
STORAGE_ENDPOINT=http://minio:9000
STORAGE_FORCE_PATH_STYLE=true

# AWS S3 (clear STORAGE_ENDPOINT)
STORAGE_ENDPOINT=
STORAGE_FORCE_PATH_STYLE=false
AWS_S3_REGION=ap-southeast-3
```

MinIO is auto-configured on startup via `minio-init` container (buckets, IAM user, CORS, lifecycle rules).

---

## License

Licensed under the [MIT License][ref-license].

---

## Contact

**Van Thuan**
📧 [charlesdang.252@gmail.com][ref-author-email]

[![Github][github-shield]][ref-author-github]

<!-- THIRD PARTY -->

[ref-ack]: https://github.com/andrechristikan/ack-nestjs-boilerplate
[ref-nestjs]: http://nestjs.com
[ref-mongodb]: https://docs.mongodb.com/
[ref-redis]: https://redis.io
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-docker]: https://docs.docker.com
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
