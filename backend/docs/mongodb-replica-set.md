# MongoDB Replica Set

## Tại sao phải dùng Replica Set?

Project này dùng **Prisma** làm ORM cho MongoDB. Prisma yêu cầu MongoDB chạy ở chế độ **Replica Set** vì nó phụ thuộc vào **multi-document ACID transactions** — tính năng này chỉ hoạt động trên replica set, không hoạt động trên standalone MongoDB.

Nếu MongoDB **không** phải replica set, các thao tác sau sẽ throw lỗi:

```
PrismaClientKnownRequestError: Transactions are not supported by this deployment
```

Điều này ảnh hưởng đến:
- Nested writes (tạo record cha + record con trong 1 lần)
- `prisma.$transaction([...])`
- Relation connect/disconnect đòi hỏi tính toàn vẹn dữ liệu

### Replica Set trong dự án này

Dù chỉ có **1 node MongoDB** (single-node replica set), vẫn phải khai báo replica set để kích hoạt tính năng transaction:

```
Replica Set "rs0"
└── Primary Node: mongo:27017  (node duy nhất trong dev/staging)
```

---

## Tổng quan theo môi trường

| Tính năng              | Development            | Staging                | Production             |
|------------------------|------------------------|------------------------|------------------------|
| Replica Set            | ✅ `rs0`               | ✅ `rs0`               | ✅ `rs0`               |
| Authentication (`--auth`) | ✅ Bật              | ✅ Bật                 | ✅ Bật                 |
| Keyfile bắt buộc       | ✅ Có                  | ✅ Có                  | ✅ Có                  |
| Số node                | 1 (single)             | 1 (single)             | ≥ 3 (recommended)     |
| Deploy qua             | `docker-compose.dev.yml` | `docker-compose.staging.yml` | Managed/self-hosted  |

---

## Development

### Tại sao cần Keyfile ở Dev?

Dev bật `--auth` (username/password) để đảm bảo môi trường local gần giống production nhất có thể. Khi `--auth` và `--replSet` cùng bật, MongoDB **bắt buộc** phải có `--keyFile` để các node có thể xác thực nội bộ với nhau.

Thiếu keyfile → MongoDB từ chối khởi động:

```
BadValue: security.keyFile is required when authorization is enabled with replica sets
```

### Tạo Keyfile (lần đầu)

```bash
npm run generate:mongo-key
```

Output: `docker/mongo/mongo.key` — chuỗi base64 ngẫu nhiên ~1008 ký tự.

> **Lưu ý**: File này đã có trong `.gitignore` (`*.key`). **Tuyệt đối không commit lên git.**

Rotate keyfile (khi cần):

```bash
npm run generate:mongo-key -- --force
```

### Khởi động Services

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up -d
```

### Cách hoạt động bên trong Docker

```yaml
# docker-compose.dev.yml
mongo:
  command: >-
    bash -c
    "cp /etc/mongo/mongo.key /tmp/mongo.key &&
    chmod 400 /tmp/mongo.key &&
    chown mongodb:mongodb /tmp/mongo.key &&
    mongod --replSet rs0 --bind_ip_all --keyFile /tmp/mongo.key --auth"
  volumes:
    - ./docker/mongo/mongo.key:/etc/mongo/mongo.key:ro
```

**Tại sao phải copy sang `/tmp`?**

File mount từ Windows host vào Linux container không giữ được Unix permission. MongoDB yêu cầu keyfile phải có permission `400`. Nếu không đúng, MongoDB từ chối với lỗi:

```
permissions on /etc/mongo/mongo.key are too open
```

Giải pháp: copy vào `/tmp` bên trong container, rồi mới `chmod 400 + chown`.

### Connection String (Dev)

```env
DATABASE_URL=mongodb://<user>:<password>@localhost:27017/<dbname>?authSource=admin&replicaSet=rs0&directConnection=true
```

---

## Staging

Staging mirror production về security — bật `--auth` + `--keyFile`, giống dev.

### Cơ chế deploy

CI/CD (GitHub Actions) **chỉ deploy app container** qua SSH/EC2 SSM. MongoDB, Redis, MinIO được chạy tách biệt trên server bằng `docker-compose.staging.yml` và **không restart mỗi lần deploy**. Vì vậy:

> **Keyfile chỉ cần provisioned 1 lần khi setup server lần đầu.** CI/CD không cần đụng đến nó.

### Quy trình setup server lần đầu (one-time)

**Bước 1 — Generate keyfile trên máy local**

```bash
npm run generate:mongo-key
# Output: docker/mongo/mongo.key
```

**Bước 2 — Copy keyfile lên server**

```bash
# Tạo thư mục trên server
ssh user@staging-server "mkdir -p ~/app/docker/mongo"

# Copy keyfile (không commit vào git, copy trực tiếp)
scp docker/mongo/mongo.key user@staging-server:~/app/docker/mongo/mongo.key
```

**Bước 3 — Clone repo và setup env trên server**

```bash
ssh user@staging-server
cd ~/app
git clone <repo-url> .
cp .env.example .env.staging
# Điền các biến DATABASE_USERNAME, DATABASE_PASSWORD, v.v.
```

**Bước 4 — Khởi động supporting services**

```bash
# Chạy 1 lần, MongoDB/Redis/MinIO sẽ chạy liên tục
docker compose --env-file .env.staging -f docker-compose.staging.yml up -d
```

Từ đây, mỗi lần CI/CD deploy chỉ update **app container**, không động đến MongoDB hay keyfile.

### Connection String (Staging)

```env
DATABASE_URL=mongodb://<user>:<password>@localhost:5304/<dbname>?authSource=admin&replicaSet=rs0&directConnection=true
```

---

## Production

Production có cùng cơ chế với staging. Keyfile được provisioned **1 lần khi setup server**, sau đó không cần thay đổi trừ khi cố ý rotate.

### Quy trình setup server lần đầu (one-time)

**Bước 1 — Tạo keyfile riêng cho production (không dùng chung với staging)**

```bash
# Generate keyfile mới hoàn toàn cho production
# Lưu content vào GitHub Secret hoặc password manager ngay sau khi generate
cat docker/mongo/mongo.key  # copy nội dung này
```

Hoặc generate thẳng trên server production (an toàn hơn — private key không bao giờ rời khỏi server):

```bash
# Trên production server
mkdir -p ~/app/docker/mongo
openssl rand -base64 756 > ~/app/docker/mongo/mongo.key
chmod 400 ~/app/docker/mongo/mongo.key
```

**Bước 2 — Lưu keyfile content vào GitHub Secret để có thể khôi phục khi cần**

```
GitHub → Settings → Secrets and variables → Actions
Tên: PROD_MONGO_KEYFILE (hoặc STAGING_MONGO_KEYFILE)
Value: <nội dung file mongo.key>
```

> Đây là backup để tái tạo file nếu server bị mất dữ liệu — không dùng để push qua CI.

**Bước 3 — Khởi động supporting services trên server**

```bash
ssh user@prod-server "cd ~/app && \
  docker compose --env-file .env.production -f docker-compose.staging.yml up -d"
# Production dùng staging compose hoặc tạo docker-compose.production.yml riêng
```

### Nếu cần khôi phục keyfile từ GitHub Secret (disaster recovery)

```bash
# Trong GitHub Actions hoặc trực tiếp trên server:
echo "$PROD_MONGO_KEYFILE" > ~/app/docker/mongo/mongo.key
chmod 400 ~/app/docker/mongo/mongo.key

# Restart MongoDB
docker compose -f docker-compose.staging.yml restart mongo
```

### Connection String (Production)

```env
DATABASE_URL=mongodb://<user>:<password>@localhost:5304/<dbname>?authSource=admin&replicaSet=rs0&directConnection=true
```



### Yêu cầu Keyfile ở Production

Production cần ít nhất:
- `--auth` bật (authentication bắt buộc)
- `--keyFile` cho nội bộ replica set
- Replica set ≥ 3 nodes (1 Primary + 2 Secondary) để đảm bảo high availability

> **Keyfile production KHÔNG được tạo bằng `npm run generate:mongo-key` và lưu trong repo.**
> Phải dùng secrets manager (AWS Secrets Manager, HashiCorp Vault, Docker Secrets...).

### Các cách provisioning Keyfile cho Production

**Option 1 — Docker Secrets (Swarm)**

```yaml
# docker-compose.prod.yml
mongo:
  secrets:
    - mongo_keyfile
  command: >-
    bash -c
    "cp /run/secrets/mongo_keyfile /tmp/mongo.key &&
    chmod 400 /tmp/mongo.key &&
    chown mongodb:mongodb /tmp/mongo.key &&
    mongod --replSet rs0 --bind_ip_all --keyFile /tmp/mongo.key --auth"

secrets:
  mongo_keyfile:
    external: true  # Tạo trước bằng: docker secret create mongo_keyfile <file>
```

**Option 2 — Environment variable + tmpfs (Kubernetes)**

```yaml
# Kubernetes Secret → mount vào pod dưới dạng file
volumeMounts:
  - name: mongo-keyfile
    mountPath: /etc/mongo
    readOnly: true
volumes:
  - name: mongo-keyfile
    secret:
      secretName: mongo-keyfile
      defaultMode: 0400
```

**Option 3 — Cloud-managed MongoDB (Recommended)**

Dùng MongoDB Atlas hoặc AWS DocumentDB — không cần quản lý keyfile thủ công, replica set được managed sẵn.

### Connection String (Production)

```env
DATABASE_URL=mongodb://<user>:<password>@mongo1:27017,mongo2:27017,mongo3:27017/<dbname>?authSource=admin&replicaSet=rs0
# Không dùng directConnection=true ở production (cần driver tự discover primary)
```

---

## `npm run generate:mongo-key` — Khi nào dùng?

| Môi trường  | Cần chạy? | Keyfile nằm ở đâu | Ghi chú |
|-------------|-----------|-------------------|---------|
| Development | ✅ Có     | `docker/mongo/mongo.key` (local) | Chạy 1 lần trước `docker compose up` |
| Staging     | ✅ Có     | `/app/docker/mongo/mongo.key` (trên server) | Generate local, copy lên server qua SCP/CI |
| Production  | ❌ Không  | Quản lý bằng secrets manager | Không lưu keyfile trong repo |

---

## Troubleshooting

### `BadValue: security.keyFile is required`

Chỉ xảy ra ở dev. Chạy:

```bash
npm run generate:mongo-key
docker compose --env-file .env.development -f docker-compose.dev.yml restart mongo
```

### `permissions on ... are too open`

Không xảy ra trong setup hiện tại (đã có bước `chmod 400` bên trong container). Nếu vẫn gặp, kiểm tra command trong `docker-compose.dev.yml` có đủ `chmod 400` và `chown mongodb:mongodb`.

### `not primary` hoặc `not master`

Replica set chưa được init. Chạy lại mongo-init:

```bash
# Dev
docker compose -f docker-compose.dev.yml up mongo-init --force-recreate

# Staging
docker compose -f docker-compose.staging.yml up mongo-init --force-recreate
```

### Xóa data và bắt đầu lại (Dev)

```bash
# Xóa containers + volumes
docker compose -f docker-compose.dev.yml down -v

# Khởi động lại (keyfile hiện có vẫn dùng được)
docker compose --env-file .env.development -f docker-compose.dev.yml up -d
```

---

## Tham khảo

- [Prisma — MongoDB requirements](https://www.prisma.io/docs/orm/overview/databases/mongodb)
- [MongoDB — Keyfile Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#keyfiles)
- [MongoDB — Deploy Replica Set with Keyfile](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-authentication/)
- [MongoDB — Transactions](https://www.mongodb.com/docs/manual/core/transactions/)
