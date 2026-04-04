# 📸 Hướng Dẫn Thiết Kế Kiến Trúc Polymorphic Media (Media Attachment)

## 1. Giới thiệu tổng quan
Trong các dự án phần mềm, tính năng quản lý Media (hình ảnh, video, tài liệu) là không thể thiếu. Việc thiết kế hệ thống CSDL (Database) từ đầu một cách chuẩn xác sẽ giúp hệ thống dễ dàng mở rộng (scale), không bị rác dữ liệu, và tăng tốc độ truy vấn. 

Tài liệu này trình bày quy chuẩn thiết kế **Many-to-Many Polymorphic Media**, một kiến trúc độc lập, mạnh mẽ có thể áp dụng cho **mọi dự án** (NodeJS, Java, PHP,...) và đa dạng ORM (Prisma, TypeORM, Hibernate) mà không phụ thuộc vào nền tảng cụ thể nào.

---

## 2. Các phương pháp quản lý Media: Tại sao chọn 2 Bảng?

Có hai cách thiết kế Polymorphic phổ biến:

### A. Mô hình 1 bảng (One-to-Many Polymorphic)
Lưu trực tiếp cột `entity_id` và `entity_type` thẳng vào bảng `Media`. 
* **Nhược điểm chí mạng:** Một file tải lên bị "khóa cứng" vào một đối tượng duy nhất. Nếu bạn có 1 bức ảnh Banner muốn dùng chung cho 10 Bài Viết khác nhau, bạn phải copy file đó ra 10 bản ghi Media riêng biệt, gây tốn dung lượng Server/AWS S3 và dẫn tới trùng lặp dữ liệu không thể dọn dẹp.

### B. Mô hình 2 bảng (Many-to-Many Polymorphic) - ĐƯỢC ƯU TIÊN
Đây là kiến trúc tiêu chuẩn theo dạng Backend "Media Library" (giống WordPress hay Laravel Spatie). Được chia làm 2 bảng:
1. **Bảng `Media` (Đại diện File Vật Lý):** Chứa dữ liệu cốt lõi của file (kích thước, định dạng, thẻ hash bảo vệ, S3 CDN URL, metadata kỹ thuật).
2. **Bảng trung gian `MediaAttachment` (Logic Liên Kết):** Đóng vai trò là cầu nối đa hình. 

**✅ Lợi thế:** 
* **Tái sử dụng (Reusability):** Một bản ghi `Media` đơn lẻ có thể attach tới 1 User làm Avatar, và đồng thời attach tới 1 Bài Viết làm khung Thumbnail một cách tự do.
* **Upload độc lập (Orphan Uploads):** Cho phép người dùng upload file vào thư viện chung trước, rồi lấy id để attach vào đối tượng sau rất linh hoạt.
* **Mềm dẻo & Logic riêng biệt:** Lưu trữ thêm thuộc tính phụ ở cầu nối (ví dụ: `purpose` để đánh dấu một đối tượng đang có nhiều ảnh nhưng ảnh nào là 'gallery', ảnh nào là 'cover').

---

## 3. Cấu trúc Database (Schema ví dụ với Prisma ORM)

Dù bạn dùng CSDL nào (MySQL, DB PostgresSQL hay MongoDB), sơ đồ quan hệ đều được quy chuẩn theo dạng sau:

```prisma
// 1. Thực thể File vật lý gốc (Media)
model Media {
  id            String    @id @default(uuid())
  filename      String
  mimeType      String    // image/png, video/mp4, application/pdf...
  completedUrl  String    // Link URL public của Cloud S3 / CDN
  metadata      Json?     // Dữ liệu tuỳ biến (ví dụ: { "width": 1920, "height": 1080 })
  createdAt     DateTime  @default(now())

  // Chuỗi liên kết đa hình
  attachments   MediaAttachment[]
}

// 2. Chốt chặn kết nối đa hình (MediaAttachment)
model MediaAttachment {
  id             String    @id @default(uuid())
  
  // POLYMORPHIC FIELDS (Cấu thành nên sự đa hình)
  attachableType String    // Tên của Model sở hữu: "Product", "User", "Article"...
  attachableId   String    // ID định danh của Bản ghi sở hữu

  mediaId        String
  media          Media     @relation(fields: [mediaId], references: [id])
  
  purpose        String    @default("default") // Chức năng của liên kết: "avatar", "banner"
  orderBy        Int       @default(0)         // Dùng sắp xếp lại thứ tự nếu làm dạng Slider
}
```

*Lưu ý: Ở các Bảng gốc mang tính nghiệp vụ (Ví dụ Bảng `Product` hay Bảng `User`) chúng ta không cần/không thể định nghĩa Foreign Key trỏ tới bảng `MediaAttachment`. Logic kết hợp hai bảng này sẽ được code bằng tay ở tầng Backend Controller/Service Framework.*

---

## 4. Xử lý Fetch Logic tại Backend Framework (Chống N+1)

Khi viết Query Data ở Backend, cần chú ý tuân thủ tuyệt đối hai kịch bản sau:

### 4.1. Kịch bản Detail Fetching (Lấy 1 bản ghi cụ thể)
Được dùng ở các trang Get Information ID/Slug cụ thể. Bạn query thông tin đối tượng trước, sau đó query bảng `MediaAttachment` để gom danh sách ảnh theo sau.

```typescript
// Kéo Bài viết gốc cần xem
const article = await db.article.findUnique({ where: { id: req.params.id } });

// Query lọc mảng media bằng polymorphic field `attachableId`
const mediaAttachments = await db.mediaAttachment.findMany({
  where: { 
    attachableType: 'Article', 
    attachableId: article.id 
  },
  include: { media: true } // Joins để lấy Data lõi File thực tế
});

// Chắp vá và trả về cho Client Front-End
return { 
    ...article, 
    media: mediaAttachments 
};
```

### 4.2. Kịch bản List Pagination (Lấy danh sách hàng loạt)
**Nghiêm cấm dùng For-Loop Database.** Nếu bạn lặp 50 rows và gởi 50 truy vấn lên DB, hệ thống sẽ gây nghẽn cổ chai với lỗi `N+1 Query` kinh điển.  
**Giải pháp bắt buộc:** Sử dụng Logic Mảng (Data Batching In-Query).

```typescript
// Bước 1: Load phân trang 50 record User
const users = await db.user.findMany({ take: 50, skip: 0 });
const userIds = users.map(u => u.id); // Ép mảng lấy ID toàn bộ tập dữ liệu

// Bước 2: Chỉ với 1 Lệnh Query DUY NHẤT, lấy toàn bộ file media của 50 người
const allAttachments = await db.mediaAttachment.findMany({
  where: {
    attachableType: 'User',
    attachableId: { in: userIds }, // Truy vấn SQL IN Array
  },
  include: { media: true }
});

// Bước 3: Chắp vá trả tự động tại Runtime Memory thay vì Query DB 50 lần
const resultList = users.map(user => {
  // Lọc array trên RAM bằng code Javascript/Golang/Java...
  const userMedia = allAttachments.filter(m => m.attachableId === user.id);
  
  return { 
      ...user, 
      media: userMedia 
  };
});
```

---

## 5. Cấp Độ Siêu Tối Ưu Cache Database (Denormalization - Phi chuẩn hoá)

Trong những hệ thống MicroServices có tỷ lệ luồng Đọc/Read cao khổng lồ, ngay cả giải pháp Batch In-Query ở trên cũng sẽ tiêu tốn bộ nhớ RAM Application để thực hiện lệnh Map/Filter Array. 

**Giải pháp tối thượng: Găm Cứng Data Cache (Phi Chuẩn Hoá)**
Bất cứ một Domain Model nào đáp ứng 2 điều kiện: Chỉ cần xem `1 ảnh duy nhất` khi nằm ngoài `List View`, và nội dung ảnh đó `ít bị thay đổi`, ta hãy sẵn sàng vi phạm chuẩn Design DB để thêm cứng chuỗi String liên kết.

```prisma
// Trong bảng Object gốc, thêm thẳng field lưu Data chết
model User {
  id        String   @id
  name      String
  avatarUrl String?  // Field Cache URL Phi Chuẩn Hoá
}
```

* **Tần suất Read (Frontend GET List):** API Select bảng `User` và trả thẳng `avatarUrl` trực tiếp xuống cho UI. (Giảm độ trễ Memory về O(1), vứt bỏ hoàn toàn công đoạn Mapping bảng đa hình).
* **Tần suất Write (Admin Cập nhật Ảnh):** Viết Background Job hoặc Observer ở Backend: Cứ mỗi khi Entity `User` nhận Request sửa Avatar (Đồng nghĩa với tác vụ Update bảng `MediaAttachment`) -> Controller sẽ tự động lấy thuộc tính String `completedUrl` dán đè update ngược thẳng vào cột `avatarUrl` dư thừa trên bảng `User`.

Sự giao thoa hoàn hảo giữa quy chuẩn gốc **Many-to-Many Polymorphic** và kỹ thuật thực dụng **Denormalization** sẽ mang lại cho mọi dự án khả năng duy trì File gọn nhẹ nhất, đồng thời giữ vững tốc độ Time To Interactive (TTI) nhanh nhất ở phía người dùng.
