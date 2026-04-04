# Service Price — Đặc tả Nghiệp vụ Quản lý Giá Dịch vụ

## 1. Mô tả

Mỗi dịch vụ bảo dưỡng xe máy (VehicleService) có giá khác nhau tuỳ theo dòng xe (VehicleModel). Sự khác biệt đến từ dung tích xi-lanh, độ phức tạp kỹ thuật và vật tư tiêu hao.

### Ví dụ thực tế

| Dịch vụ | Honda Wave (110cc) | Honda SH 150i | Honda SH 300i |
|---------|-------------------|---------------|---------------|
| Thay nhớt | 150,000đ | 250,000đ | 350,000đ |
| Vệ sinh buồng đốt | 200,000đ | 350,000đ | 500,000đ |

---

## 2. Cấu trúc dữ liệu

### VehicleService (Dịch vụ)

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `basePrice` | Int | Giá mặc định áp dụng cho **tất cả** dòng xe khi chưa có giá riêng |

### ServicePrice (Bảng giá theo dòng xe)

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `price` | Int | Giá dịch vụ (VNĐ) |
| `vehicleServiceId` | FK → VehicleService | Dịch vụ nào |
| `vehicleModelId` | FK → VehicleModel | Dòng xe nào |
| `dateStart` | DateTime | Giá có hiệu lực từ ngày nào |
| `dateEnd` | DateTime? | `null` = **đang hiện hành**, có giá trị = đã hết hạn |

> **Quy tắc:** Tại mọi thời điểm, mỗi cặp `(vehicleServiceId, vehicleModelId)` chỉ có **tối đa 1 bản ghi** với `dateEnd = null`. Logic này được đảm bảo tại Service layer, không phải DB constraint (vì cần giữ lịch sử giá).

---

## 3. Quy tắc tra cứu giá (Price Resolution)

Khi cần xác định giá cho một cặp (Dịch vụ + Dòng xe):

```
Bước 1: Tìm ServicePrice có:
          vehicleServiceId = X
          vehicleModelId   = Y
          dateEnd           = null   ← đang hiện hành
          deletedAt         = null

Bước 2: Nếu TÌM THẤY → dùng ServicePrice.price     (giá riêng cho dòng xe)
        Nếu KHÔNG     → dùng VehicleService.basePrice (giá mặc định)
```

### Ví dụ

```
VehicleService "Thay nhớt" → basePrice = 150,000đ

ServicePrice tồn tại:
  "Thay nhớt" + SH 150i  = 250,000đ  (dateEnd = null)
  "Thay nhớt" + SH 300i  = 350,000đ  (dateEnd = null)

→ Tra giá "Thay nhớt" + Wave RSX  → không có ServicePrice → 150,000đ (basePrice)
→ Tra giá "Thay nhớt" + SH 150i   → có ServicePrice       → 250,000đ
```

### Tại sao cần `basePrice`?

Nếu hệ thống có 30 dòng xe và 50 dịch vụ, không thể bắt Admin thiết lập 1,500 mức giá. Với `basePrice`, Admin chỉ cần tạo `ServicePrice` cho **ngoại lệ** (xe cao cấp giá khác). Số lượng giảm từ ~1,500 xuống còn ~100-200 bản ghi.

---

## 4. Luồng nghiệp vụ

### 4.1 Admin thiết lập giá lần đầu

```
1. Tạo VehicleService "Thay nhớt", basePrice = 150,000đ
2. Tạo ServicePrice cho các dòng xe cao cấp:
   → "Thay nhớt" + SH 150i  = 250,000đ  dateStart = now(), dateEnd = null
   → "Thay nhớt" + SH 300i  = 350,000đ  dateStart = now(), dateEnd = null
3. Các dòng xe khác tự dùng basePrice 150,000đ
```

### 4.2 Admin thay đổi giá

```
VD: Tăng "Thay nhớt + SH 150i" từ 250k lên 280k

1. Tìm bản ghi hiện hành: vehicleServiceId + vehicleModelId + dateEnd = null
   → Tìm thấy: id=#3, price = 250,000đ

2. Đóng bản ghi cũ:
   → UPDATE #3: dateEnd = now()

3. Tạo bản ghi mới:
   → INSERT: price = 280,000, dateStart = now(), dateEnd = null

Kết quả trong DB:
  #3  price=250k  dateStart=2025-01-01  dateEnd=2026-04-03   ← lịch sử
  #4  price=280k  dateStart=2026-04-03  dateEnd=null          ← hiện hành
```

### 4.3 Đóng băng giá khi tạo phiếu bảo dưỡng

```
Khách mang Honda SH 150i vào thay nhớt:

1. Hệ thống tra cứu giá: resolvePrice("thay-nhot", "sh-150i") → 280,000đ
2. Tạo CareRecordItem:
     vehicleServiceId = "thay-nhot"
     unitPrice        = 280,000   ← SNAPSHOT (đóng băng vĩnh viễn)
     quantity         = 1
     totalPrice       = 280,000

→ Admin thay đổi giá lên 300k vào ngày mai → đơn này vẫn GIỮ NGUYÊN 280k.
   Lý do: unitPrice đã được lưu cứng vào CareRecordItem, không reference tới ServicePrice.
```

---

## 5. Phân tích kinh doanh (Lịch sử giá)

Mọi thay đổi giá đều được lưu lại (không xoá bản ghi cũ, chỉ đặt `dateEnd`):

```sql
-- Lịch sử giá "Thay nhớt + SH 150i" qua các năm
SELECT price, dateStart, dateEnd
FROM ServicePrice
WHERE vehicleServiceId = 'thay-nhot'
  AND vehicleModelId = 'sh-150i'
ORDER BY dateStart ASC;

-- Kết quả:
-- 200,000đ  2024-01 → 2024-06
-- 230,000đ  2024-06 → 2025-01
-- 250,000đ  2025-01 → 2026-04
-- 280,000đ  2026-04 → null (hiện tại)
```

Dùng lịch sử này để:
- Theo dõi xu hướng tăng/giảm giá theo thời gian
- So sánh doanh thu trước/sau điều chỉnh giá
- Báo cáo biên lợi nhuận theo quý

---

## 6. Tối ưu hiệu năng

### Vấn đề

Mỗi lần tra cứu giá cần query DB (ServicePrice + fallback VehicleService). Nếu nhiều người dùng đồng thời tra cứu → quá tải DB.

### Giải pháp: Redis Cache

Bảng giá thay đổi **rất ít** (Admin sửa vài lần/tháng) nhưng được đọc **rất nhiều** (mỗi khách đặt lịch = tra giá). Đây là bài toán read-heavy, write-rare → cache là giải pháp tối ưu.

```
Tra cứu giá:
  1. Check Redis: key = "price:{serviceId}:{modelId}"
     → HIT  → return từ cache           (0ms, không query DB)
     → MISS → query DB → lưu Redis (TTL: 24h) → return

Admin thay đổi giá:
  1. Update DB (đóng bản ghi cũ, tạo mới)
  2. Invalidate cache: DEL "price:{serviceId}:{modelId}"
  → Lần query tiếp theo tự rebuild cache từ DB
```

### Nâng cao: Pre-build Price Matrix

Khi admin thay đổi giá bất kỳ → build toàn bộ bảng giá vào Redis Hash:

```
HSET price_matrix "serviceA:modelX" 250000
HSET price_matrix "serviceA:modelY" 150000
...
```

Tra cứu = `HGET price_matrix "serviceA:modelX"` → O(1), không bao giờ cần query DB.
