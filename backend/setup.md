# Developer Setup Guide

Hướng dẫn này giúp bạn cài đặt và chạy dự án **Motorbike System Backend** trên máy local trong thời gian ngắn nhất.

---

## Yêu cầu

| Công cụ | Phiên bản tối thiểu | Ghi chú                                                                                                |
| ------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| Node.js | `>= 22`             | Dùng [nvm](https://github.com/nvm-sh/nvm) hoặc [fnm](https://github.com/Schniz/fnm) để quản lý version |
| npm     | `>= 10`             | Đi kèm Node.js, **không dùng pnpm/yarn**                                                               |
| Docker  | `>= 24`             | Cần chạy tất cả supporting services (MongoDB, Redis, MinIO...)                                         |

---

## Bước 1 — Cài đặt dependencies

```bash
npm install
```

---

## Bước 2 — Cấu hình môi trường

Copy file env mẫu và điền các giá trị cần thiết:

```bash
cp .env.example .env.development
```

Các biến **bắt buộc** phải điền trước khi chạy:

```env
# Database
DATABASE_URL=mongodb://motorbike:changeme123@127.0.0.1:27017/motorbike_system?authSource=admin&replicaSet=rs0&directConnection=true
DATABASE_USERNAME=motorbike
DATABASE_PASSWORD=changeme

# MinIO root credentials (dùng cho docker-compose.dev.yml)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=changeme

# MinIO app credentials (cho NestJS app kết nối)
AWS_S3_IAM_CREDENTIAL_KEY=app-backend-user
AWS_S3_IAM_CREDENTIAL_SECRET=changeme

# Bull Board
BULL_BOARD_USER=admin
BULL_BOARD_PASSWORD=changeme
```

> Các biến còn lại (Google, Apple, Firebase, SES...) để trống cũng được khi dev local.

---

## Bước 3 — Tạo JWT Keys

Project dùng JWKS (ES256/ES512) cho xác thực. Cần tạo key pair trước khi chạy:

```bash
npm run generate:keys
```

> Script sẽ tự động cập nhật `AUTH_JWT_*_PRIVATE_KEY`, `PUBLIC_KEY`, `KID` vào `.env.development`
> và tạo file `keys/access-jwks.json`, `keys/refresh-jwks.json` cho JWKS Server.

---

## Bước 3.5 - Tạo Mongo Key

```bash
npm run generate:mongo-key
```

---

## Bước 4 — Khởi động Supporting Services

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development up -d
```

Services được khởi động:

| Service       | URL                      | Mục đích                                  |
| ------------- | ------------------------ | ----------------------------------------- |
| MongoDB       | `localhost:27017`        | Database (Replica Set, Prisma-compatible) |
| JWKS Server   | `http://localhost:5301`  | Serve public keys cho JWT verify          |
| Redis         | `localhost:6379`         | Cache + queue                             |
| Bull Board    | `http://localhost:5303`  | Monitor BullMQ queues                     |
| MinIO API     | `http://localhost:39000` | S3-compatible storage                     |
| MinIO Console | `http://localhost:39001` | Quản lý bucket qua UI                     |

> `minio-init` sẽ tự chạy và tạo buckets/user/policy rồi thoát — không cần làm thủ công.

---

## Bước 5 — Setup Database

### Generate Prisma Client

```bash
npm run db:generate
```

### Push schema lên MongoDB

```bash
npm run db:migrate
```

### Seed dữ liệu ban đầu

```bash
npm run migration:seed
```

> Lệnh này sẽ tạo: API Keys, Roles, Feature Flags, Countries, Term Policies, Users mặc định.

---

## Bước 6 — Chạy ứng dụng

```bash
npm run start:dev
```

App sẽ chạy tại: `http://localhost:5300`

API Documentation (Swagger): `http://localhost:5300/api/docs`

---

## Lệnh thường dùng

| Lệnh                      | Mô tả                                       |
| ------------------------- | ------------------------------------------- |
| `npm run start:dev`       | Chạy app với hot-reload                     |
| `npm run db:generate`     | Regenerate Prisma client sau khi sửa schema |
| `npm run db:migrate`      | Push schema changes lên MongoDB             |
| `npm run db:studio`       | Mở Prisma Studio (GUI database)             |
| `npm run migration:seed`  | Seed dữ liệu mặc định                       |
| `npm run migration:fresh` | Reset DB và seed lại từ đầu                 |
| `npm run generate:keys`   | Tạo mới JWT key pair                        |
| `npm run lint`            | Kiểm tra linting                            |
| `npm run format`          | Format code với Prettier                    |
| `npm run typecheck`       | Kiểm tra TypeScript types                   |
| `npm run test`            | Chạy unit tests                             |

---

## Kiểm tra services đang chạy

```bash
# Xem tất cả containers dev
docker compose -f docker-compose.dev.yml ps

# Xem logs của một service
docker compose -f docker-compose.dev.yml logs -f minio-init

# Dừng tất cả services
docker compose -f docker-compose.dev.yml down
```

---

## Troubleshooting

### ❌ JWT verify lỗi 401

JWKS Server phải chạy **trước** khi app start. Kiểm tra:

```bash
curl http://localhost:5301/.well-known/access-jwks.json
```

Nếu không trả về JSON → chạy lại `npm run generate:keys` rồi restart `jwks-server`.

### ❌ Prisma lỗi "replica set not found"

MongoDB phải chạy ở replica set mode. Chạy lại bước 3 và đảm bảo `DATABASE_URL` có `replicaSet=rs0`.

### ❌ MinIO lỗi kết nối

Kiểm tra `STORAGE_ENDPOINT=http://localhost:39000` trong `.env.development`. Nếu `minio-init` thất bại, xem log:

```bash
docker logs motorbike-dev-minio-init
```

### ❌ Container lỗi mount volume sau khi xóa và tạo lại file/folder trên host

**Triệu chứng:** Container không start được, log báo lỗi tương tự:

```
OCI runtime create failed: error mounting "..." to rootfs at "...":
Are you trying to mount a directory onto a file (or vice-versa)?
```

**Nguyên nhân:** Khi Docker đang chạy mà file/folder được bind mount bị **xóa** trên host, Docker sẽ tự tạo một **directory placeholder** thay thế. Sau đó dù bạn tạo lại đúng file gốc, container vẫn giữ metadata mount cũ (directory) → xung đột kiểu file vs directory.

**Ví dụ thực tế:** Xóa thư mục `keys/` chứa `access-jwks.json` → Docker cache mount cũ là directory → tạo lại file `access-jwks.json` vẫn lỗi.

**Cách khắc phục:**

```bash
# Xóa container bị lỗi và tạo lại
docker compose -f docker-compose.dev.yml rm -f <service-name>
docker compose -f docker-compose.dev.yml up -d <service-name>

# Hoặc recreate toàn bộ
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

> **Lưu ý:** Nếu file mount là file được generate (ví dụ JWT keys), hãy chạy lại lệnh generate trước:
>
> ```bash
> npm run generate:keys
> ```

### ❌ Port bị chiếm

| Port    | Service       |
| ------- | ------------- |
| `27017` | MongoDB       |
| `5301`  | JWKS Server   |
| `6379`  | Redis         |
| `5303`  | Bull Board    |
| `39000` | MinIO API     |
| `39001` | MinIO Console |
| `5300`  | NestJS App    |

---

## Cấu trúc thư mục chính

```
backend/
├── src/                    # Source code NestJS
│   ├── modules/           # Feature modules (auth, user, vehicle...)
│   ├── common/            # Shared services (aws, file, cache...)
│   └── configs/           # App configuration
├── prisma/
│   └── schema.prisma      # Database schema (MongoDB)
├── keys/                  # JWT key files (không commit)
├── docker/
│   ├── Dockerfile         # Production image
│   └── minio/policies/    # MinIO IAM/CORS/lifecycle config
├── scripts/
│   └── generate-keys.ts   # Script tạo JWT key pair
├── docker-compose.dev.yml     # Supporting services cho local dev
├── docker-compose.staging.yml # Full stack cho staging/production
├── .env.example               # Template env file
└── .env.development           # Local env (không commit)
```
