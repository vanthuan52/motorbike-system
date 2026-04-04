# 📸 Hướng Dẫn Sử Dụng Kiến Trúc Polymorphic Media (Media Attachment)

## 1. Giới thiệu

Trong các hệ thống lớn, việc upload và lưu trữ hình ảnh/media là một bài toán cốt lõi. Tài liệu này giải thích cách hoạt động của hệ thống Media tại dự án, tại sao lại chọn quy chuẩn thiết kế này, và cung cấp các đoạn code mẫu dễ hiểu để team dễ dàng áp dụng ở mọi dự án.

Hệ thống Media của chúng ta được thiết kế theo chuẩn **Many-to-Many Polymorphic (Quan hệ đa hình N-N thông qua bảng trung gian)**.

---

## 2. Vì sao phải sử dụng thiết kế 2 Bảng (Many-to-Many Polymorphic)?

Nhiều người thắc mắc: "Tại sao không lưu Polymorphic thẳng vào 1 bảng Media duy nhất mà lại tách ra làm Media và MediaAttachment?". Sự tách biệt này đem lại lợi thế khổng lồ để scale hệ thống (Enterprise-level):

1. **Phân tách trách nhiệm (Separation of Concerns):**
   - **Bảng `Media`**: Là đối chiếu vật lý của File trên ổ cứng/AWS S3 (chứa dung lượng, mimeType, S3 URL, hash bảo mật).
   - **Bảng `MediaAttachment`**: Là Logic Nghiệp vụ (File này được attach vào đâu `VehicleBrand` hay `User`, làm `avatar` hay `logo`, đứng ở vị trí thứ mấy trong slide `orderBy`).

2. **Tái sử dụng (Reusability):**
   Một tấm ảnh có thể được attach vào hàng trăm đối tượng khác nhau (VD: Ảnh Khuyến mãi dùng chung cho 20 dòng xe). Do có bảng trung gian, chúng ta không bị lặp ("duplicate") dòng file vật lý tốn tiền S3, mà chỉ sinh ra các liên kết nhẹ nhàng ở bảng Attachment.

3. **Media Library Độc lập (Wordpress-style):**
   Người dùng có thể thỏa thích upload ảnh lên thư viện lưu trữ chung (tạo bảng Media) rồi mới kéo thả/attach vào Model sau đó mà không sợ bị khoá cứng (locked).

---

## 3. Thiết kế Database với Prisma

Đây là thiết kế tiêu chuẩn sử dụng trong Backend dự án:

```prisma
// Bảng Media (Chỉ chứa thông tin cục bộ vật lý của File)
model Media {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  filename      String
  mimeType      String
  completedUrl  String    // S3 URL của ảnh
  metadata      Json?     // Dùng lưu trữ thông tin kỹ thuật đặc thù (VD: width/height ảnh, duration video, pageCount của PDF)
  mediaAttachments MediaAttachment[]
}

// Bảng MediaAttachment (Kết nối Media với bất cứ Model nghiệp vụ nào)
model MediaAttachment {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId

  // POLYMORPHIC FIELDS
  attachableType String    // Phân loại Model: "VehicleBrand", "User", "Store", etc.
  attachableId   String    @db.ObjectId // ID của Object thuộc Model tương ứng

  mediaId        String    @db.ObjectId
  media          Media     @relation(fields: [mediaId], references: [id])
  purpose        String    @default("default") // "logo", "thumbnail", "cover_photo", vv..
}
```

> [!WARNING]
> Lưu ý: Vì Prisma không hỗ trợ `@relation` tự động quy chiếu ngược dò Type đa hình (như TypeORM), nên Entity gốc (ví dụ `VehicleBrand`) trong sơ đồ DB **sẽ không khai báo** liên kết với `MediaAttachment`. Việc kết nối hoàn toàn dựa trên Logic Code tại Service Layer.

---

## 4. Cách thao tác với Media Attachment bằng TypeScript

### 4.1. Cách Query một đối tượng đơn lẻ (Detail Query)

Khi truy vấn 1 bản ghi qua ID hay Slug (như xem chi tiết xe), hãy thực hiện thêm 1 hàm lấy mảng Media độc lập.

```typescript
const brand = await prisma.vehicleBrand.findUnique({
  where: { slug: "honda" },
});
if (!brand) return null;

// Lọc media bằng polymorphic field
const mediaAttachments = await prisma.mediaAttachment.findMany({
  where: { attachableType: "VehicleBrand", attachableId: brand.id },
  include: { media: true }, // cực quan trọng để lấy Data URL thật của ảnh
});

// Mapper Domain tự kết nối lại thành Entity thống nhất
return VehicleBrandMapper.toDomain({ ...brand, mediaAttachments });
```

### 4.2. Cách Query hàng loạt (List Query) & Chống N+1 Cực Mạnh

Nếu bạn có danh sách đang phân trang (Paginate) 20 Brand trên giao diện, và dùng vòng lặp FOR để gửi 20 yêu cầu (như ví dụ trên) cho DB, hệ thống sẽ sụp đổ khi bị Request cường độ cao (N+1 Query Problem).

**Giải pháp bắt buộc:** Sử dụng kiểu truy vấn Batching In-Array (`{ in: ... }`).

```typescript
// 1. Phải truy xuất Pagination Array trước
const brands = await prisma.vehicleBrand.findMany({ take: 20 });
if (!brands.length) return [];

// Bước bản lề: Gom tất cả ID vào mảng tĩnh
const brandIds = brands.map((b) => b.id);

// 2. Load gộp toàn bộ MediaAttachment của TẤT CẢ brands trên (Chỉ mất 1 Network DB Query)
const allMedias = await prisma.mediaAttachment.findMany({
  where: {
    attachableType: "VehicleBrand",
    attachableId: { in: brandIds },
  },
  include: { media: true }, // Lấy kèm lõi S3 URL & metadata
});

// 3. Phân bổ rải lại dữ liệu (Mapping về bộ nhớ RAM NodeJS Cache)
const result = brands.map((brand) => {
  const brandMedias = allMedias.filter((m) => m.attachableId === brand.id);
  return VehicleBrandMapper.toDomain({
    ...brand,
    mediaAttachments: brandMedias,
  });
});
```

---

## 5. Tối ưu cực đại (Denormalization - Phi chuẩn hóa)

Batch Query giải quyết N+1 hiệu quả nhưng nếu Context yêu cầu gọi list vài ngàn rows, các hàm filter map mảng trên NodeJS vẫn cắn hao Memory & CPU. Đặc biệt là rất nhiều bảng (VD `VehicleBrand`) chỉ dùng đúng 1 `Logo` duy nhất minh hoạ cho UI.

**Kỹ Thuật Caching cứng xuống Database (Denormalization)**

Vi phạm nguyên tắc SQL có chủ đích: Ta sẽ hardcode thêm Data vào bảng Entity chính để lúc lấy danh sách hoàn toàn bỏ qua bước query `MediaAttachment`.

```prisma
model VehicleBrand {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  photoCdnUrl String?  // Field Phi Chuẩn Hoá
}
```

**Workflow sau khi tinh gọn:**

- **Lấy Danh sách (List):** API trả về trực tiếp `brand.photoCdnUrl` (siêu nhanh, tiết kiệm Server Node resource do không cần filter arrays).
- **Sync Dữ liệu:** Viết Trigger/Logic: Cứ mỗi khi Admin upload `MediaAttachment` cho Vehicle Brand (CUD operations) -> Lấy Field `completedUrl` nhét Update ngược vào `photoCdnUrl` luôn.

Bằng việc kết hợp kiến trúc **Many-to-Many Polymorphic** độc lập, cộng với tư duy lấy luồng phân trang **Denormalization**, Team Tech sẽ làm chủ mọi module scale to millions traffic mà không gặp trở ngại nào về quản lý File!
