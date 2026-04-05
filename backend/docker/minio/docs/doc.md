# MinIO — Object Storage Setup

MinIO cung cấp S3-compatible object storage cho môi trường development và staging/production. Toàn bộ cấu hình được tự động hoá qua `minio-init` container trong docker-compose — **không cần thao tác thủ công**.

## Cấu trúc thư mục

```
docker/minio/
├── policies/
│   ├── app-policy.json      ← IAM policy: quyền CRUD cho app user
│   ├── cors-public.json     ← CORS rules cho public bucket
│   ├── cors-private.json    ← CORS rules cho private bucket
│   └── lifecycle.json       ← Lifecycle rules (abort incomplete multipart, delete markers)
└── docs/
    └── doc.md               ← Tài liệu này
```

## Cách hoạt động

Khi chạy `docker compose up`, `minio-init` container tự động thực hiện **6 bước**:

| Bước | Việc làm |
|------|----------|
| 1 | Tạo `public bucket` và `private bucket` (nếu chưa có) |
| 2 | Tạo app user với credentials từ env |
| 3 | Tạo IAM policy từ `app-policy.json` và gán cho app user |
| 4 | Bật anonymous public read trên public bucket |
| 5 | Áp CORS rules (`cors-public.json` / `cors-private.json`) |
| 6 | Áp Lifecycle rules (`lifecycle.json`) cho cả 2 bucket |

Sau khi hoàn tất, `minio-init` tự thoát. Toàn bộ quá trình là **idempotent** — chạy lại bao nhiêu lần cũng không bị lỗi.

## Cấu hình qua Environment Variables

Tất cả tham số được inject từ file `.env` — không có giá trị hardcode trong compose hay policy files.

| Variable | Ý nghĩa | Ví dụ |
|---|---|---|
| `MINIO_ROOT_USER` | Admin root user | `minioadmin` |
| `MINIO_ROOT_PASSWORD` | Admin root password | `changeme` |
| `AWS_S3_IAM_CREDENTIAL_KEY` | App user access key | `app-backend-user` |
| `AWS_S3_IAM_CREDENTIAL_SECRET` | App user secret key | `changeme` |
| `AWS_S3_PUBLIC_BUCKET` | Tên public bucket | `app-public-files` |
| `AWS_S3_PRIVATE_BUCKET` | Tên private bucket | `app-private-files` |
| `STORAGE_ENDPOINT` | MinIO endpoint cho app | `http://minio:9000` |
| `STORAGE_FORCE_PATH_STYLE` | Luôn `true` với MinIO | `true` |

## Ports (staging docker-compose)

| Port | Service |
|---|---|
| `5305` | MinIO API (S3-compatible endpoint) |
| `5306` | MinIO Console (Web UI) |

Truy cập Console tại: `http://localhost:5306` — đăng nhập bằng `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`.

## Bucket access model

| Bucket | Anonymous | App user |
|---|---|---|
| `app-public-files` | GET (read-only) | Full CRUD |
| `app-private-files` | ❌ Không có | Full CRUD |

## Chuyển sang AWS S3 thật

Chỉ cần thay đổi env vars — **không sửa code**:

```env
# Để trống STORAGE_ENDPOINT → tự động chuyển sang AWS S3 mode
STORAGE_ENDPOINT=
STORAGE_FORCE_PATH_STYLE=false

AWS_S3_IAM_CREDENTIAL_KEY=<aws-iam-access-key>
AWS_S3_IAM_CREDENTIAL_SECRET=<aws-iam-secret-key>
AWS_S3_REGION=ap-southeast-3
```

Khi dùng AWS S3, việc setup bucket/policy/CORS được thực hiện qua `AwsS3Service.setting*()` methods hoặc Terraform/CDK.
