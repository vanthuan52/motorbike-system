# Design a Chat System

> **Tài liệu thiết kế hệ thống (System Design Document)**
> Phạm vi: Chat module trong Motorbike System
> Cập nhật: 02/04/2026

---

## Mục lục

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [High-Level Design](#2-high-level-design)
3. [Component Design](#3-component-design)
4. [Data Model Design](#4-data-model-design)
5. [Communication Protocol](#5-communication-protocol)
6. [Message Flow Design](#6-message-flow-design)
7. [Presence System](#7-presence-system)
8. [Storage & Caching Strategy](#8-storage--caching-strategy)
9. [Security Design](#9-security-design)
10. [Error Handling](#10-error-handling)
11. [Scalability & Performance](#11-scalability--performance)
12. [Trade-offs & Quyết định thiết kế](#12-trade-offs--quyết-định-thiết-kế)

---

## 1. Yêu cầu hệ thống

### 1.1 Functional Requirements

| # | Yêu cầu | Ưu tiên |
|---|---------|---------|
| FR-1 | Gửi/nhận tin nhắn 1-1 theo thời gian thực | P0 |
| FR-2 | Hỗ trợ đa loại nội dung: text, image, video, file | P0 |
| FR-3 | Trạng thái tin nhắn: Sent → Delivered → Read | P0 |
| FR-4 | Typing indicator (đang soạn thảo) | P1 |
| FR-5 | Lịch sử tin nhắn với phân trang | P0 |
| FR-6 | Xoá tin nhắn (phía mình) | P1 |
| FR-7 | Thu hồi tin nhắn (cho tất cả, giới hạn 24h) | P1 |
| FR-8 | Trạng thái online/offline (Presence) | P1 |
| FR-9 | Last seen timestamp | P2 |
| FR-10 | Quản lý hội thoại (tạo, liệt kê) | P0 |

### 1.2 Non-Functional Requirements

| # | Yêu cầu | Mục tiêu |
|---|---------|----------|
| NFR-1 | **Low latency** | Tin nhắn tới receiver trong < 200ms |
| NFR-2 | **Reliability** | Không mất tin nhắn (persist trước khi push) |
| NFR-3 | **Ordering** | Tin nhắn hiển thị đúng thứ tự thời gian |
| NFR-4 | **Security** | Xác thực JWT, không giả mạo sender |
| NFR-5 | **Availability** | Hệ thống chat hoạt động 24/7 |
| NFR-6 | **Consistency** | Cùng conversation → thấy cùng tin nhắn |

### 1.3 Back-of-the-Envelope Estimation

Giả sử hệ thống phục vụ **10,000 DAU** (Motorbike service platform):

```
Tin nhắn/ngày:  10,000 users × 20 messages/user = 200,000 msg/ngày
Tin nhắn/giây:  200,000 / 86,400 ≈ 2.3 msg/s (trung bình)
Peak:           × 5 = ~12 msg/s (giờ cao điểm)
Storage/ngày:   200,000 × 500 bytes ≈ 100 MB/ngày
Storage/năm:    100 MB × 365 ≈ 36 GB/năm
Connections:    ~2,000 concurrent WebSocket connections (20% DAU)
```

→ **Kết luận**: Với quy mô này, single server + MongoDB + Redis là đủ. Kiến trúc cần đơn giản, dễ maintain, nhưng **sẵn sàng** để scale khi cần.

---

## 2. High-Level Design

### 2.1 Tổng quan kiến trúc

```
                          ┌─────────────┐
                          │   Clients   │
                          │ (Web/Mobile)│
                          └──────┬──────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              HTTP/REST    WebSocket     File Upload
              (port 3000)  (port 5002)   (Media Module)
                    │            │            │
          ┌─────────┴──┐  ┌─────┴──────┐  ┌──┴─────────┐
          │    REST     │  │  WebSocket │  │   Media    │
          │ Controllers │  │  Gateway   │  │   Module   │
          │             │  │            │  │            │
          │ • List convs│  │ • Send msg │  │ • Upload   │
          │ • Create    │  │ • Read     │  │ • CDN URL  │
          │ • History   │  │ • Typing   │  │            │
          └──────┬──────┘  └─────┬──────┘  └────────────┘
                 │               │
                 └───────┬───────┘
                         │
               ┌─────────┴─────────┐
               │   Business Layer   │
               │                    │
               │  MessageService    │
               │  ConversationSvc   │
               │  PresenceService ──┼──── Redis Cache
               └─────────┬─────────┘
                         │
               ┌─────────┴─────────┐
               │   Data Layer       │
               │                    │
               │  Repositories      │
               │  Mappers           │
               └─────────┬─────────┘
                         │
               ┌─────────┴─────────┐
               │     MongoDB        │
               │                    │
               │  • conversations   │
               │  • messages        │
               └────────────────────┘
```

### 2.2 Phân tách giao thức

Hệ thống chat dùng **2 giao thức song song**, mỗi giao thức phục vụ mục đích khác nhau:

| Giao thức | Port | Dùng cho | Lý do |
|-----------|------|----------|-------|
| **WebSocket** | 5002 | Gửi/nhận tin nhắn, typing, presence, delete/unsend | Cần realtime, bidirectional |
| **HTTP REST** | 3000 | Tạo conversation, lịch sử tin nhắn, cập nhật status | Request/Response đơn giản, cacheable, paginated |

```
                    Mobile App / Web App
                    ┌──────────────────┐
                    │                  │
                    │  REST API calls  │──── Khi cần: tạo conversation, load history
                    │  (HTTP)          │     (stateless, paginated, cacheable)
                    │                  │
                    │  WebSocket conn  │──── Luôn mở: gửi/nhận tin, typing, presence
                    │  (persistent)    │     (stateful, bidirectional, realtime)
                    │                  │
                    └──────────────────┘
```

### 2.3 Design Philosophy

**Nguyên tắc cốt lõi**: _"Persist before push"_ — Luôn lưu tin nhắn vào DB **trước** khi broadcast. Nếu server crash giữa chừng, tin nhắn không bao giờ bị mất.

```
Client A gửi tin nhắn
      │
      ▼
 1. Validate (JWT, participant check)
      │
      ▼
 2. Persist to MongoDB        ← Tin nhắn AN TOÀN ở đây
      │
      ▼
 3. Update Conversation.lastMessageId
      │
      ▼
 4. Broadcast to room (WebSocket)
      │
      ▼
 5. Auto-deliver nếu receiver online (Redis check)
```

---

## 3. Component Design

### 3.1 Sơ đồ thành phần

```
┌────────────────────────────────────────────────────────┐
│                      ChatModule                         │
│                                                         │
│  ┌─────────────────┐     ┌──────────────────────────┐  │
│  │   Presentation   │     │      Guards               │  │
│  │                  │     │                          │  │
│  │  ChatGateway ────┼────▶│  WsJwtGuard              │  │
│  │  (WebSocket)     │     │  (JWT verify handshake)  │  │
│  │                  │     └──────────────────────────┘  │
│  │  Controllers     │                                   │
│  │  (REST API)      │                                   │
│  └────────┬─────────┘                                   │
│           │                                              │
│  ┌────────▼──────────────────────────────────────────┐  │
│  │                 Business Layer                      │  │
│  │                                                     │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │  │
│  │  │ Message      │ │ Conversation │ │ Presence   │  │  │
│  │  │ Service      │ │ Service      │ │ Service    │  │  │
│  │  │              │ │              │ │            │  │  │
│  │  │ • send       │ │ • create     │ │ • setOn    │  │  │
│  │  │ • read       │ │ • findByUser │ │ • setOff   │  │  │
│  │  │ • deliver    │ │ • update     │ │ • isOnline │  │  │
│  │  │ • delete     │ │ • lastMsg    │ │ • renew    │  │  │
│  │  │ • unsend     │ │              │ │            │  │  │
│  │  └──────┬───────┘ └──────┬───────┘ └─────┬──────┘  │  │
│  └─────────┼────────────────┼───────────────┼──────────┘  │
│            │                │               │              │
│  ┌─────────▼────────────────▼───────┐ ┌─────▼──────────┐  │
│  │         Data Layer               │ │   Redis Cache  │  │
│  │                                  │ │                │  │
│  │  MessageRepository               │ │  presence:     │  │
│  │  ConversationRepository          │ │  {userId}      │  │
│  │                                  │ │  TTL: 30min    │  │
│  │  ┌─────────────────────┐        │ └────────────────┘  │
│  │  │ Mappers             │        │                      │
│  │  │ Prisma → Domain     │        │                      │
│  │  └─────────────────────┘        │                      │
│  └──────────────┬───────────────────┘                     │
│                 │                                          │
└─────────────────┼──────────────────────────────────────────┘
                  │
          ┌───────▼───────┐
          │   MongoDB     │
          │               │
          │ conversations │
          │ messages      │
          └───────────────┘
```

### 3.2 Trách nhiệm từng thành phần

#### ChatGateway (Presentation)

| Trách nhiệm | KHÔNG được làm |
|-------------|----------------|
| ✅ Nhận events từ client | ❌ Truy cập DB trực tiếp |
| ✅ Gọi Service methods | ❌ Chứa business logic |
| ✅ Broadcast kết quả | ❌ Biết về Prisma types |
| ✅ Quản lý rooms (join/leave) | ❌ Validate nghiệp vụ phức tạp |

#### MessageService (Business)

| Trách nhiệm | KHÔNG được làm |
|-------------|----------------|
| ✅ Validate business rules | ❌ Biết về Socket/HTTP |
| ✅ Gọi Repository | ❌ Import WebSocket types |
| ✅ Enforce thời hạn thu hồi | ❌ Emit events |
| ✅ Quản lý trạng thái tin nhắn | ❌ Tạo Conversation (SRP) |

#### PresenceService (Business)

| Trách nhiệm | KHÔNG được làm |
|-------------|----------------|
| ✅ Quản lý online/offline via Redis | ❌ Quản lý Socket connections |
| ✅ Cung cấp `isOnline()` cho Service khác | ❌ Broadcast events |
| ✅ TTL-based auto-expiry | ❌ Biết về WebSocket |

#### Repository (Data Access)

| Trách nhiệm | KHÔNG được làm |
|-------------|----------------|
| ✅ CRUD operations | ❌ Chứa business rules |
| ✅ Map Prisma → Domain Model | ❌ Validate dữ liệu |
| ✅ Hỗ trợ transaction | ❌ Gọi Service khác |
| ✅ Filter `deletedAt: null` | ❌ Biết về DTO/Response |

### 3.3 Dependency Flow (Quy tắc phụ thuộc)

```
Gateway ──▶ Service ──▶ Repository ──▶ Database
   │           │            │
   │           │            └── Mapper (Prisma → Domain)
   │           │
   │           └── Domain Models (MessageModel, ConversationModel)
   │
   └── DTOs (SendMessageDto, ReadMessageDto, ...)

Luồng xuôi: Gateway → Service → Repository → DB
Luồng ngược: DB → Mapper → Domain Model → Service → Gateway → Client

⚠️ KHÔNG ĐƯỢC: Repository → Service (ngược chiều)
⚠️ KHÔNG ĐƯỢC: Gateway → Repository (bỏ qua Service)
```

---

## 4. Data Model Design

### 4.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User (existing)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ id            │ ObjectId (PK)                       │    │
│  │ name          │ String                              │    │
│  │ email         │ String (unique)                     │    │
│  │ lastSeenAt    │ DateTime? ← NEW                     │    │
│  │ ...           │                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│         ▲                        ▲                           │
│         │ 1:N (sender)           │ 1:N (receiver)            │
│         │                        │                           │
│  ┌──────┴────────────────────────┴──────────────────────┐   │
│  │                     Message                           │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │ id              │ ObjectId (PK)               │   │   │
│  │  │ content         │ String                      │   │   │
│  │  │ messageType     │ "text"|"image"|"video"|"file"│   │   │
│  │  │ status          │ "sent"|"delivered"|"read"    │   │   │
│  │  │ timestamp       │ DateTime (indexed, ordered)  │   │   │
│  │  │ readBy          │ ObjectId[] (who has read)    │   │   │
│  │  │ isUnsent        │ Boolean (recalled?)          │   │   │
│  │  │ attachments     │ Json? (file metadata)        │   │   │
│  │  │ deletedAt       │ DateTime? (soft delete)      │   │   │
│  │  │ senderId        │ ObjectId → User (FK)         │   │   │
│  │  │ receiverId      │ ObjectId → User (FK)         │   │   │
│  │  │ conversationId  │ ObjectId → Conversation (FK) │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  └──────────┬────────────────────────────────────────────┘   │
│             │ N:1                                             │
│  ┌──────────▼────────────────────────────────────────────┐   │
│  │                   Conversation                         │   │
│  │  ┌───────────────────────────────────────────────┐    │   │
│  │  │ id              │ ObjectId (PK)               │    │   │
│  │  │ participantIds  │ ObjectId[] (2 users)        │    │   │
│  │  │ lastMessageId   │ ObjectId? (denormalized)    │    │   │
│  │  │ deletedAt       │ DateTime? (soft delete)     │    │   │
│  │  └───────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Index Strategy

```
messages:
  ├── conversationId    (compound: lấy tin nhắn theo conversation)
  ├── senderId          (filter tin nhắn theo sender)
  ├── receiverId        (filter tin nhắn theo receiver)
  └── timestamp         (ORDER BY cho pagination, infinite scroll)

conversations:
  └── participantIds    (tìm conversation của user)
```

### 4.3 Quyết định thiết kế quan trọng

#### Tại sao `readBy: String[]` thay vì `isRead: Boolean`?

```
Phương án A: isRead: Boolean
  ✗ Chỉ biết đã đọc hay chưa, không biết AI đọc
  ✗ Không mở rộng được cho group chat

Phương án B: readBy: String[]  ← CHỌN
  ✓ Biết chính xác ai đã đọc
  ✓ Sẵn sàng cho group chat (nhiều người đọc)
  ✓ Dễ tính "2/5 người đã xem"
```

#### Tại sao `lastMessageId` (denormalized) trong Conversation?

```
Không có lastMessageId:
  → Mỗi lần list conversations, phải JOIN + ORDER BY + LIMIT 1 cho TỪNG conversation
  → N+1 query problem

Có lastMessageId (denormalized):
  → 1 query duy nhất lấy tất cả conversations + last message
  → Trade-off: cần update mỗi khi gửi tin nhắn mới (thêm 1 write)
  → Đánh đổi chấp nhận được (write ít, read nhiều)
```

#### Tại sao `isUnsent` + clear content thay vì hard delete?

```
Hard delete:
  ✗ Mất track audit trail
  ✗ Client cũ vẫn hiển thị tin nhắn (không đồng bộ)

Soft unsend (isUnsent=true, content=''):  ← CHỌN
  ✓ Client biết có tin nhắn đã thu hồi → hiển thị "Tin nhắn đã thu hồi"
  ✓ Audit trail giữ nguyên (ai gửi, thời điểm nào)
  ✓ Đồng bộ trên tất cả client
```

---

## 5. Communication Protocol

### 5.1 WebSocket — Lifecycle

```
Client                          Server (Gateway)
  │                                │
  │ ── TCP Handshake ─────────────▶│
  │                                │
  │ ── HTTP Upgrade Request ──────▶│
  │    Headers:                    │
  │    Connection: Upgrade         │
  │    Upgrade: websocket          │
  │    Auth: { token: JWT }        │
  │                                │
  │                                │── WsJwtGuard.canActivate()
  │                                │   ├── Extract token
  │                                │   ├── Verify JWT signature
  │                                │   ├── Check expiry
  │                                │   └── Attach userId to socket.data
  │                                │
  │ ◀── 101 Switching Protocols ───│
  │                                │
  │ ══════ WebSocket Open ═════════│
  │                                │
  │                                │── handleConnection()
  │                                │   ├── PresenceService.setOnline(userId)
  │                                │   └── Broadcast userStatus (online)
  │                                │
  │ ── joinConversation ──────────▶│── Join Socket.IO room
  │ ◀── joinedConversation ────────│
  │                                │
  │ ── sendMessage ───────────────▶│── Process + Broadcast
  │ ◀── newMessage ────────────────│
  │                                │
  │        ... (bidirectional) ... │
  │                                │
  │ ── disconnect ────────────────▶│── handleDisconnect()
  │                                │   ├── PresenceService.setOffline()
  │                                │   └── Broadcast userStatus (offline)
  │                                │
  │ ══════ WebSocket Closed ═══════│
```

### 5.2 Socket.IO Room Pattern

```
Conversation Room = conversationId

Room "conv_abc123":
  ┌─────────────┐
  │ Socket A    │ ← User A joined
  │ Socket B    │ ← User B joined
  └─────────────┘

Khi User A emit('sendMessage'):
  → server.to("conv_abc123").emit('newMessage', msg)
  → Cả Socket A và Socket B đều nhận được

Khi User A emit('typing'):
  → client.broadcast.to("conv_abc123").emit('typingStatus', ...)
  → Chỉ Socket B nhận (broadcast = tất cả TRỪ sender)
```

### 5.3 Event Contract

#### Send Message — Request/Response

```json
// Client → Server
Event: "sendMessage"
Payload: {
  "conversation": "665a1b2c...",     // conversationId
  "receiver": "665a3d4e...",         // receiverId
  "content": "Xe em bảo dưỡng xong chưa ạ?",
  "messageType": "text",
  "attachments": null                // optional
}
// Lưu ý: sender KHÔNG có trong payload — lấy từ JWT

// Server → Client (broadcast to room)
Event: "newMessage"
Payload: {
  "id": "665b5f6a...",
  "content": "Xe em bảo dưỡng xong chưa ạ?",
  "messageType": "text",
  "status": "sent",
  "timestamp": "2026-04-02T14:30:00.000Z",
  "senderId": "665a1b2c...",
  "receiverId": "665a3d4e...",
  "conversationId": "665a1b2c...",
  "readBy": ["665a1b2c..."],
  "isUnsent": false,
  "attachments": null
}
```

#### Attachment Message Example

```json
// Client → Server
Event: "sendMessage"
Payload: {
  "conversation": "665a1b2c...",
  "receiver": "665a3d4e...",
  "content": "Hình ảnh xe sau bảo dưỡng",
  "messageType": "image",
  "attachments": [
    {
      "url": "https://cdn.example.com/media/photo_123.jpg",
      "filename": "xe_sau_bao_duong.jpg",
      "mimeType": "image/jpeg",
      "size": 245760,
      "thumbnailUrl": "https://cdn.example.com/media/photo_123_thumb.jpg"
    }
  ]
}
```

---

## 6. Message Flow Design

### 6.1 Happy Path — Cả 2 online

```
User A (Online)          Server              Redis           MongoDB         User B (Online)
   │                       │                   │                │                │
   │ emit(sendMessage)     │                   │                │                │
   │──────────────────────▶│                   │                │                │
   │                       │                   │                │                │
   │                       │ 1. Verify JWT     │                │                │
   │                       │ 2. Enforce sender │                │                │
   │                       │ 3. Find conv      │                │                │
   │                       │──────────────────────────────────▶│                │
   │                       │◀─── ConversationModel ────────────│                │
   │                       │                   │                │                │
   │                       │ 4. Verify participant              │                │
   │                       │                   │                │                │
   │                       │ 5. Save message   │                │                │
   │                       │──────────────────────────────────▶│                │
   │                       │◀─── MessageModel ─────────────────│                │
   │                       │                   │                │                │
   │                       │ 6. Update lastMsg │                │                │
   │                       │──────────────────────────────────▶│                │
   │                       │                   │                │                │
   │    newMessage         │ 7. Broadcast      │                │   newMessage   │
   │◀──────────────────────│───────────────────────────────────────────────────▶│
   │                       │                   │                │                │
   │                       │ 8. Check presence │                │                │
   │                       │──────────────────▶│                │                │
   │                       │◀── isOnline: true │                │                │
   │                       │                   │                │                │
   │                       │ 9. Mark delivered  │                │                │
   │                       │──────────────────────────────────▶│                │
   │  messageDelivered     │ 10. Broadcast     │                │ msgDelivered  │
   │◀──────────────────────│───────────────────────────────────────────────────▶│
   │                       │                   │                │                │
```

### 6.2 Receiver Offline

```
User A (Online)          Server              Redis           MongoDB         User B (Offline)
   │                       │                   │                │                ✗
   │ emit(sendMessage)     │                   │                │                ✗
   │──────────────────────▶│                   │                │                ✗
   │                       │   ... same steps 1-7 ...          │                ✗
   │    newMessage         │                   │                │                ✗
   │◀──────────────────────│                   │                │                ✗
   │                       │ 8. Check presence │                │                ✗
   │                       │──────────────────▶│                │                ✗
   │                       │◀── isOnline: false│                │                ✗
   │                       │                   │                │                ✗
   │                       │ Status stays "sent"│               │                ✗
   │                       │                   │                │                ✗
   │                       │   ┌──────────────────────────┐    │                ✗
   │                       │   │ 📱 Future: Push notif    │    │                ✗
   │                       │   │ via FCM/APNs             │    │                ✗
   │                       │   └──────────────────────────┘    │                ✗
   │                       │                   │                │                │
   │                       │      [User B comes online later]  │                │
   │                       │                   │                │                │
   │                       │                   │                │  GET /messages │
   │                       │◀──────────────────────────────────────────────────│
   │                       │─── messages (status=sent) ────────────────────────▶│
   │                       │                   │                │                │
   │                       │                   │                │  readMessage   │
   │                       │◀──────────────────────────────────────────────────│
   │   messageRead         │ Update status=read│                │                │
   │◀──────────────────────│──────────────────────────────────▶│                │
```

### 6.3 Message State Machine

```
                          ┌───────────┐
                          │           │
                    ┌─────│  CREATED  │
                    │     │           │
                    │     └───────────┘
                    │
           Persist to DB
                    │
                    ▼
              ┌───────────┐     Receiver online     ┌─────────────┐
              │           │ ────────────────────▶   │             │
              │   SENT    │     (auto-trigger)      │  DELIVERED  │
              │           │                         │             │
              └─────┬─────┘                         └──────┬──────┘
                    │                                      │
                    │         readMessage event             │
                    │ ─────────────────────────────────────▶│
                    │                                      │
                    │              ┌───────────┐           │
                    └──────────────│           │◀──────────┘
                                  │   READ    │
                                  │           │
                                  └───────────┘

Invariant: Trạng thái chỉ đi TIẾN, không bao giờ LÙI
           READ → DELIVERED (×) không cho phép
```

### 6.4 Unsend Flow (Thu hồi)

```
                ┌────────────────────────────┐
                │      Message exists         │
                │                            │
                │  Sender gọi unsendMessage  │
                │                            │
                └─────────────┬──────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Sender === JWT     │
                    │ userId?            │
                    └─────────┬─────────┘
                         Yes  │  No → ForbiddenException
                              │
                    ┌─────────▼─────────┐
                    │ Timestamp < 24h?  │
                    │                   │
                    └─────────┬─────────┘
                         Yes  │  No → BadRequestException
                              │       "unsendTimeLimitExceeded"
                              │
                    ┌─────────▼─────────┐
                    │ Update in DB:      │
                    │ • isUnsent = true  │
                    │ • content = ''     │
                    │ • attachments = ∅  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Broadcast to room: │
                    │ "messageUnsent"    │
                    └───────────────────┘
```

---

## 7. Presence System

### 7.1 Architecture

```
┌────────────────────────────────────────────┐
│              PresenceService               │
│                                            │
│  Provider: PresenceCacheProvider            │
│  Backend:  @nestjs/cache-manager + Redis   │
│  Pattern:  Same as SessionUtil             │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │         Redis Storage                 │  │
│  │                                       │  │
│  │  Key: "presence:{userId}"             │  │
│  │  Val: { socketId, connectedAt }       │  │
│  │  TTL: 30 minutes                      │  │
│  │                                       │  │
│  │  presence:665a1b2c... → {             │  │
│  │    socketId: "abc123",                │  │
│  │    connectedAt: "2026-04-02T14:00:00" │  │
│  │  }                                    │  │
│  │  ⏰ Expires in: 28 min 15 sec        │  │
│  │                                       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Methods:                                  │
│  ├── setOnline(userId, socketId)           │
│  ├── setOffline(userId)                    │
│  ├── isOnline(userId) → boolean            │
│  ├── getSocketId(userId) → string|null     │
│  ├── renewPresence(userId)                 │
│  └── getOnlineUsers(userIds[]) → string[]  │
│                                            │
└────────────────────────────────────────────┘
```

### 7.2 TTL & Heartbeat Strategy

```
Timeline
═══════════════════════════════════════════════════════▶ time
│                                                      │
│  connect()     sendMsg    typing    sendMsg           │ 30 min
│     │             │         │         │               │ timeout
│     ▼             ▼         ▼         ▼               ▼
│  setOnline    [renew]    [renew]   [renew]         EXPIRED
│  TTL=30m      TTL=30m    TTL=30m   TTL=30m       (auto-offline)
│
│  Mỗi action của user → renew TTL → kéo dài online status
│
│  Nếu user mất mạng đột ngột (không disconnect):
│  → Không có renew → Redis auto-expire → User offline
│  → Không cần heartbeat riêng, mỗi action = implicit heartbeat
```

### 7.3 Graceful vs Ungraceful Disconnect

```
Graceful Disconnect:                Ungraceful Disconnect:
(User tắt app, logout)             (Mất mạng, crash app)

Client ─── disconnect() ──▶ Server     Client ──✗── (no signal)
                             │
                    handleDisconnect()      Redis TTL countdown
                             │                    │
                    setOffline(userId)            30 min
                             │                    │
                    del presence:{userId}    EXPIRE (auto)
                             │                    │
                    Broadcast: offline       Broadcast: offline
                                           (khi có user khác query)
```

---

## 8. Storage & Caching Strategy

### 8.1 Tổng quan

```
┌──────────────────────────────────────────────┐
│                Data Tier                      │
│                                               │
│  ┌────────────┐         ┌─────────────────┐  │
│  │  MongoDB   │         │     Redis       │  │
│  │            │         │                 │  │
│  │ • Messages │         │ • Presence      │  │
│  │ • Convs    │         │   (TTL: 30min)  │  │
│  │ • Users    │         │                 │  │
│  │            │         │ • Session cache │  │
│  │ Persistent │         │   (TTL: config) │  │
│  │ Source of  │         │                 │  │
│  │ Truth      │         │ • App cache     │  │
│  │            │         │   (TTL: 5min)   │  │
│  └────────────┘         └─────────────────┘  │
│                                               │
│  Nguyên tắc:                                  │
│  • MongoDB = Source of Truth (bền vững)       │
│  • Redis = Hot data + Ephemeral state         │
│  • Mất Redis → rebuild từ MongoDB             │
│  • Mất MongoDB → MẤT DATA (backup bắt buộc)  │
└──────────────────────────────────────────────┘
```

### 8.2 Query Patterns & Indexes

| Query | Tần suất | Index sử dụng | Ghi chú |
|-------|----------|---------------|---------|
| Tin nhắn theo conversation (history) | Rất cao | `conversationId` + `timestamp` | Cursor pagination, ORDER BY timestamp DESC |
| Conversations của user | Cao | `participantIds` | `has` operator (MongoDB array query) |
| Tin nhắn theo sender | Trung bình | `senderId` | Filter cho delete/unsend |
| Presence check | Rất cao | Redis key lookup | O(1), không query MongoDB |

### 8.3 Pagination Strategy

```
Tin nhắn mới nhất ← CLIENT MỞ APP → tải thêm tin cũ (infinite scroll)
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Page 1 (newest)    Page 2         Page 3 (oldest) │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ msg_100      │  │ msg_80     │  │ msg_60      │ │
│  │ msg_99       │  │ msg_79     │  │ msg_59      │ │
│  │ msg_98       │  │ msg_78     │  │ msg_58      │ │
│  │ ...          │  │ ...        │  │ ...         │ │
│  │ msg_81       │  │ msg_61     │  │ msg_41      │ │
│  └──────────────┘  └────────────┘  └─────────────┘ │
│                                                     │
│  ORDER BY timestamp DESC                            │
│  Cursor: timestamp của tin nhắn cuối cùng           │
│                                                     │
│  Offset Pagination: GET /messages?page=2&perPage=20 │
│  Cursor Pagination: GET /messages?cursor=msg_80_ts  │
│                                                     │
│  ✅ Ưu tiên Cursor cho tin nhắn (không bị duplicate │
│     khi có tin mới đến giữa chừng)                  │
└─────────────────────────────────────────────────────┘
```

---

## 9. Security Design

### 9.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
│                                                          │
│  Layer 1: Transport                                      │
│  ├── HTTPS/WSS (TLS encryption in transit)              │
│  └── CORS policy (origin whitelist)                     │
│                                                          │
│  Layer 2: Authentication                                 │
│  ├── REST: @AuthJwtAccessProtected() decorator          │
│  └── WebSocket: WsJwtGuard (handshake.auth.token)       │
│                                                          │
│  Layer 3: Identity Enforcement                           │
│  ├── senderId = JWT payload.userId (KHÔNG tin client)   │
│  └── sessionId = JWT payload.sessionId                  │
│                                                          │
│  Layer 4: Authorization                                  │
│  ├── Participant check: user PHẢI thuộc conversation    │
│  ├── Unsend: chỉ sender mới được thu hồi               │
│  └── Delete: chỉ sender mới được xoá                   │
│                                                          │
│  Layer 5: Input Validation                               │
│  ├── class-validator DTOs                                │
│  └── Content length limits                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Threat Model

| Threat | Giải pháp | Status |
|--------|-----------|--------|
| **Giả mạo sender** | `sender = JWT userId`, không dùng payload từ client | ✅ Đã xử lý |
| **Truy cập conversation không thuộc** | Kiểm tra `participantIds.includes(userId)` trước mới cho join/send | ✅ Đã xử lý |
| **JWT hết hạn trên WebSocket** | WsJwtGuard verify tại handshake; client reconnect khi token mới | ✅ Đã xử lý |
| **Replay attack** | JTI rotation trong refresh token flow | ✅ Đã xử lý (Auth module) |
| **DDoS qua WebSocket** | Rate limiting (cần implement) | ⚠️ Phase 4 |
| **XSS qua tin nhắn** | Content sanitization (cần implement) | ⚠️ Phase 4 |
| **Zombie connections** | Redis TTL 30 phút auto-expire | ✅ Đã xử lý |

---

## 10. Error Handling

### 10.1 Error Flow

```
Client Action → Gateway → Service → Repository
                  │          │          │
                  │          │          └── Prisma Error → NotFoundException
                  │          │                              ForbiddenException
                  │          └── Business Rule violation → BadRequestException
                  │
                  └── Catch all → emitError(client, code, message)

WebSocket errors KHÔNG throw HTTP exceptions.
Thay vào đó, emit 'error' event về client.
```

### 10.2 Error Codes & Client Handling

| Code | Tên | Khi nào | Client nên làm gì |
|------|-----|---------|-------------------|
| 6200 | `notFound` | Resource không tồn tại | Hiển thị thông báo |
| 6201 | `invalidConversation` | Conversation không tồn tại hoặc user không thuộc | Redirect về danh sách chat |
| 6202 | `messageNotFound` | Message ID không hợp lệ | Ẩn tin nhắn, retry |
| 6203 | `missingUserId` | JWT không có userId | Force re-login |
| 6204 | `notAuthorized` | Không có quyền (delete/unsend người khác) | Hiển thị "Không có quyền" |
| 6205 | `unsendTimeLimitExceeded` | Quá 24h, không thu hồi được | Hiển thị "Đã quá thời hạn" |

---

## 11. Scalability & Performance

### 11.1 Bottleneck Analysis

```
Current State (Single Instance):
┌──────────────────────────────────────────┐
│  NestJS Server                            │
│  ├── WebSocket Gateway (port 5002)       │
│  ├── REST API (port 3000)                │
│  │                                        │
│  │  Bottleneck #1: WebSocket connections  │
│  │  → ~50,000 connections/instance        │
│  │                                        │
│  │  Bottleneck #2: MongoDB writes         │
│  │  → ~5,000 writes/s (single node)      │
│  │                                        │
│  │  Bottleneck #3: Memory                 │
│  │  → ~512 bytes/connection = 25MB/50K    │
│  │                                        │
│  └── Current load: ~2,000 connections     │
│      → 4% capacity → CHƯA CẦN SCALE     │
└──────────────────────────────────────────┘
```

### 11.2 Scaling Roadmap

```
Stage 1: Current (0-10K DAU) ← ĐANG Ở ĐÂY
┌─────────────┐     ┌────────┐     ┌──────────┐
│ Single Node │────▶│ Redis  │     │ MongoDB  │
│ NestJS      │     │ Single │     │ Single   │
└─────────────┘     └────────┘     └──────────┘


Stage 2: Growth (10K-100K DAU)
┌─────────────┐
│ Load        │     ┌────────┐     ┌──────────┐
│ Balancer    │────▶│ Redis  │     │ MongoDB  │
│ (sticky     │     │ Single │     │ Replica  │
│  sessions)  │     └────────┘     │ Set      │
│             │                    └──────────┘
│ ┌─────┐    │
│ │Node1│    │     Redis Adapter for Socket.IO
│ │Node2│    │     (sync events across instances)
│ │Node3│    │
│ └─────┘    │
└─────────────┘


Stage 3: Scale (100K+ DAU)
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│ API GW   │  │ WS LB    │  │ Redis        │  │ MongoDB      │
│          │  │ (sticky) │  │ Cluster      │  │ Sharded      │
│          │  │          │  │              │  │ Cluster      │
│ REST ──▶ │  │ WS ────▶ │  │ ┌──┐ ┌──┐   │  │              │
│          │  │          │  │ │M │ │S │   │  │ Shard key:   │
│          │  │ +Redis   │  │ └──┘ └──┘   │  │ conversationId│
│          │  │ Adapter  │  │              │  │              │
└──────────┘  └──────────┘  └──────────────┘  └──────────────┘
```

### 11.3 Key Decision: Khi nào scale?

| Metric | Hiện tại | Ngưỡng cần scale | Action |
|--------|----------|-------------------|--------|
| Concurrent WS | ~2,000 | > 40,000 | Thêm instance + Redis Adapter |
| Messages/s | ~2.3 | > 3,000 | MongoDB Replica + Sharding |
| Presence queries/s | ~10 | > 10,000 | Redis Cluster |
| API latency P99 | ~50ms | > 500ms | Horizontal scale |

---

## 12. Trade-offs & Quyết định thiết kế

### 12.1 Tổng hợp Trade-offs

| Quyết định | Pros | Cons | Lý do chọn |
|-----------|------|------|-----------|
| **WebSocket** thay vì Long Polling | Low latency, bidirectional | Stateful, khó scale | Realtime là yêu cầu core |
| **MongoDB** thay vì PostgreSQL | Flexible schema, native JSON, array queries | Weak transactions | Chat data = semi-structured, cần array operators |
| **Persist before push** | Không mất tin nhắn | Thêm latency ~5ms | Reliability > Speed |
| **Redis Presence** thay vì In-memory | Persist qua restart, shared state | Thêm dependency, +1ms latency | Đã có Redis trong stack |
| **Separate WS port** (5002) | Isolate traffic, dễ monitor | Client phải connect 2 endpoints | Tránh WS ảnh hưởng REST |
| **Soft delete + isUnsent** | Audit trail, UX đồng bộ | Storage không giảm | UX và traceability quan trọng hơn |
| **readBy array** thay vì isRead boolean | Sẵn sàng group chat | Thêm storage | Future-proof design |
| **24h unsend limit** | Tương tự Zalo/Messenger | User không vui | Cân bằng privacy sender vs receiver |

### 12.2 Kiến trúc hiện tại vs Lý tưởng

```
Hiện tại (Pragmatic):                    Lý tưởng (Overkill cho scale hiện tại):
┌─────────────────────┐                  ┌───────────────────────────────┐
│ Monolith NestJS     │                  │ Chat Microservice             │
│ + Socket.IO         │                  │ + Dedicated Message Broker    │
│ + MongoDB           │                  │ + Event Sourcing              │
│ + Redis (cache)     │                  │ + CQRS                        │
│                     │                  │ + Kafka/RabbitMQ              │
│ ✅ Đơn giản         │                  │                               │
│ ✅ Dễ debug         │                  │ ❌ Over-engineering            │
│ ✅ Ít moving parts  │                  │ ❌ Phức tạp vận hành           │
│ ✅ Phù hợp 10K DAU  │                  │ ❌ Chưa cần cho scale hiện tại │
└─────────────────────┘                  └───────────────────────────────┘

→ Chọn Pragmatic. Scale khi CẦN, không phải khi CÓ THỂ.
```

---

## Tham khảo

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [NestJS WebSocket Gateway](https://docs.nestjs.com/websockets/gateways)
- [System Design Interview — Chat System](https://bytebytego.com)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
