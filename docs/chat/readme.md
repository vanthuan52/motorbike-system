# Thiết Kế Hệ Thống Chat Realtime (System Design)

> Tài liệu này trình bày cách thiết kế một hệ thống chat 1-1 realtime từ đầu.
> Có thể sử dụng cho: **phỏng vấn System Design**, **High-Level Design review**, hoặc **áp dụng trực tiếp** vào bất kỳ dự án nào (NodeJS, Java, Go, ...).

---

## Mục lục

1. [Làm rõ yêu cầu](#1-làm-rõ-yêu-cầu)
2. [Ước lượng quy mô](#2-ước-lượng-quy-mô)
3. [High-Level Design](#3-high-level-design)
4. [Data Model](#4-data-model)
5. [Luồng gửi tin nhắn](#5-luồng-gửi-tin-nhắn)
6. [Trạng thái tin nhắn](#6-trạng-thái-tin-nhắn)
7. [Presence System (Online/Offline)](#7-presence-system)
8. [Xoá & Thu hồi tin nhắn](#8-xoá--thu-hồi-tin-nhắn)
9. [Storage & Caching](#9-storage--caching)
10. [Security](#10-security)
11. [Scalability](#11-scalability)
12. [Trade-offs](#12-trade-offs)

---

## 1. Làm rõ yêu cầu

> Trong phỏng vấn, bước đầu tiên luôn là hỏi lại interviewer để làm rõ phạm vi.

### Functional Requirements

| # | Yêu cầu | Ưu tiên |
|---|---------|---------|
| FR-1 | Gửi/nhận tin nhắn 1-1 realtime | P0 |
| FR-2 | Hỗ trợ đa loại: text, image, video, file | P0 |
| FR-3 | Trạng thái tin nhắn: Sent → Delivered → Read | P0 |
| FR-4 | Lịch sử tin nhắn (phân trang) | P0 |
| FR-5 | Typing indicator | P1 |
| FR-6 | Xoá tin nhắn (phía mình) | P1 |
| FR-7 | Thu hồi tin nhắn (cho tất cả, giới hạn 24h) | P1 |
| FR-8 | Online/Offline status | P1 |

### Non-Functional Requirements

| # | Yêu cầu | Mục tiêu |
|---|---------|----------|
| NFR-1 | Low latency | Tin nhắn tới receiver < 200ms |
| NFR-2 | Reliability | Không mất tin nhắn dù server crash |
| NFR-3 | Ordering | Tin nhắn đúng thứ tự thời gian |
| NFR-4 | Security | Xác thực JWT, không giả mạo sender |

---

## 2. Ước lượng quy mô

> Back-of-the-Envelope Estimation giúp xác định kiến trúc phù hợp.

Giả sử hệ thống phục vụ **10,000 DAU**:

```
Messages/ngày:     10,000 × 20 msg/user = 200,000
Messages/giây:     200,000 / 86,400     ≈ 2.3 (trung bình)
Peak:              × 5                  ≈ 12 msg/s
Storage/năm:       200,000 × 500 bytes × 365 ≈ 36 GB
Concurrent WS:     10,000 × 20%        = 2,000 connections
```

**Kết luận:** Với quy mô này, **single server** + NoSQL + Redis là đủ.
Kiến trúc cần đơn giản, dễ maintain, nhưng sẵn sàng scale khi cần.

> Nếu đề bài là 10M DAU → cần message queue, sharding, microservice. Xem [mục 11](#11-scalability).

---

## 3. High-Level Design

### Tại sao cần 2 giao thức?

Một sai lầm phổ biến là dùng WebSocket cho mọi thứ. Thực tế, mỗi giao thức có thế mạnh riêng:

| Giao thức | Dùng cho | Lý do |
|-----------|----------|-------|
| **WebSocket** | Gửi/nhận tin, typing, presence | Cần realtime, bidirectional, persistent connection |
| **HTTP REST** | Tạo conversation, load lịch sử, upload file | Stateless, cacheable, paginated, dễ retry |

### Kiến trúc tổng quan

```
                        ┌─────────────┐
                        │   Clients   │
                        │ (Web/Mobile)│
                        └──────┬──────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
            HTTP/REST     WebSocket    File Upload
                  │            │            │
        ┌─────────┴──┐  ┌─────┴──────┐  ┌──┴──────────┐
        │    REST     │  │  WebSocket │  │   Media     │
        │ Controllers │  │  Gateway   │  │   Service   │
        └──────┬──────┘  └─────┬──────┘  └─────────────┘
               │               │
               └───────┬───────┘
                       │
             ┌─────────┴─────────┐
             │   Business Layer   │
             │  MessageService    │
             │  ConversationSvc   │
             │  PresenceService ──┼── Cache (Redis/Memcached)
             └─────────┬─────────┘
                       │
             ┌─────────┴─────────┐
             │   Data Layer       │
             │  Repositories      │
             └─────────┬─────────┘
                       │
                   Database
              (MongoDB / PostgreSQL)
```

### Nguyên tắc cốt lõi: _"Persist before Push"_

Luôn lưu tin nhắn vào DB **trước** khi broadcast cho client.
Nếu server crash sau bước persist → tin nhắn vẫn an toàn, client reconnect sẽ lấy được.
Nếu crash trước persist → client không nhận được → tự retry.

```
Client gửi tin → 1. Validate → 2. Persist to DB → 3. Broadcast to receivers
                                    ▲
                            Tin nhắn AN TOÀN ở đây
```

---

## 4. Data Model

### Entity Relationship

```
┌──────────┐        ┌───────────────┐        ┌──────────┐
│   User   │──1:N──▶│   Message     │◀──N:1──│   User   │
│ (sender) │        │               │        │(receiver)│
└──────────┘        └───────┬───────┘        └──────────┘
                            │ N:1
                   ┌────────┴────────┐
                   │  Conversation   │
                   │ participantIds[]│── M:N ── User[]
                   └─────────────────┘
```

### Conversation

```sql
Conversation {
  id              PK
  participantIds  String[]      -- Danh sách userId tham gia
  lastMessageId   FK?           -- Denormalized: tin nhắn cuối (tránh N+1)
  createdAt       Timestamp
  deletedAt       Timestamp?    -- Soft delete
}

Index: participantIds
```

### Message

```sql
Message {
  id              PK
  content         String
  messageType     Enum          -- text | image | video | file
  timestamp       Timestamp     -- Thời điểm gửi (dùng cho ordering)
  status          Enum          -- sent | delivered | read
  readBy          String[]      -- Danh sách userId đã đọc
  isUnsent        Boolean       -- Đã thu hồi?
  attachments     JSON?         -- Metadata file đính kèm
  senderId        FK → User
  receiverId      FK → User
  conversationId  FK → Conversation
  deletedAt       Timestamp?    -- Soft delete (xoá phía mình)
}

Index: (conversationId), (senderId), (receiverId), (timestamp)
```

### Quyết định thiết kế quan trọng

**Q: Tại sao `readBy: String[]` thay vì `isRead: Boolean`?**

| | `isRead: Boolean` | `readBy: String[]` ✅ |
|---|---|---|
| Biết AI đọc | ❌ | ✅ |
| Group chat | ❌ Phải redesign | ✅ Sẵn sàng |
| Hiển thị "2/5 đã xem" | ❌ | ✅ |

**Q: Tại sao `lastMessageId` (denormalized)?**

```
Không có lastMessageId:
  → List conversations phải JOIN + ORDER BY + LIMIT 1 cho TỪNG conversation
  → N+1 query

Có lastMessageId:
  → 1 query duy nhất lấy tất cả conversations kèm last message
  → Trade-off: thêm 1 write mỗi khi gửi tin nhắn mới
  → Chấp nhận được vì write ít hơn read rất nhiều
```

**Q: Tại sao `isUnsent` thay vì hard delete?**

```
Hard delete:
  ✗ Mất audit trail
  ✗ Client cũ vẫn hiển thị (không đồng bộ)

isUnsent = true, content = '':
  ✓ Client hiển thị "Tin nhắn đã thu hồi"
  ✓ Đồng bộ mọi client
  ✓ Giữ metadata (ai gửi, lúc nào)
```

---

## 5. Luồng gửi tin nhắn

### Cả 2 online (Happy Path)

```
Sender                      Server                Cache       DB          Receiver
  │ emit(sendMessage)         │                     │           │             │
  │──────────────────────────▶│                     │           │             │
  │                           │ 1. Verify auth      │           │             │
  │                           │ 2. Enforce sender   │           │             │
  │                           │     = token.userId  │           │             │
  │                           │ 3. Verify sender    │           │             │
  │                           │    ∈ participants   │           │             │
  │                           │ 4. Persist message ────────────▶│             │
  │                           │ 5. Update lastMsg  ────────────▶│             │
  │    newMessage             │ 6. Broadcast        │           │  newMessage │
  │◀──────────────────────────│──────────────────────────────────────────────▶│
  │                           │ 7. Check presence ─▶│           │             │
  │                           │◀── online: true     │           │             │
  │                           │ 8. Mark delivered  ────────────▶│             │
  │    messageDelivered       │ 9. Notify           │           │  delivered  │
  │◀──────────────────────────│──────────────────────────────────────────────▶│
```

### Receiver offline

```
  ... bước 1-6 giống trên ...
  Server check presence → offline
  → Status giữ nguyên "sent"
  → (Tuỳ chọn) Gửi Push Notification qua FCM/APNs

  [Receiver mở app sau đó]
  → REST API: GET /messages?conversationId=xxx  (load tin chưa đọc)
  → WebSocket: emit readMessage                 (đánh dấu đã đọc)
```

---

## 6. Trạng thái tin nhắn

### State Machine

```
              ┌──────────┐
              │  CREATED  │
              └─────┬─────┘
           Persist to DB
              ┌─────▼─────┐    Receiver online    ┌───────────┐
              │    SENT    │───────────────────────▶│ DELIVERED │
              └─────┬──────┘    (auto-trigger)     └─────┬─────┘
                    │                                     │
                    │         readMessage event           │
                    │────────────────────────────────────▶│
                    │                                     │
                    │           ┌────────┐               │
                    └──────────▶│  READ  │◀──────────────┘
                                └────────┘

Quy tắc: Trạng thái chỉ đi TIẾN, không bao giờ LÙI.
         READ → DELIVERED → SENT (✗ không cho phép)
```

### Chuyển trạng thái

| Từ → Tới | Trigger | Ai trigger? |
|-----------|---------|-------------|
| Sent → Delivered | Receiver đang online | Server (tự động) |
| Delivered → Read | Receiver mở conversation | Receiver (emit readMessage) |
| Sent → Read | Receiver đọc ngay | Receiver (bỏ qua Delivered) |

---

## 7. Presence System

### Kiến trúc

```
┌──────────────────────────────────────┐
│         Presence Service             │
│                                      │
│  Storage: Redis / Memcached          │
│                                      │
│  Key:   "presence:{userId}"          │
│  Value: { socketId, connectedAt }    │
│  TTL:   30 phút (tự động expire)    │
│                                      │
│  setOnline(userId, socketId)         │
│  setOffline(userId)                  │
│  isOnline(userId) → boolean          │
│  renewPresence(userId)               │
└──────────────────────────────────────┘
```

### TTL & Implicit Heartbeat

```
Timeline ═══════════════════════════════════════▶ time

  connect()    sendMsg    typing    sendMsg         30 min timeout
     │           │          │         │                │
     ▼           ▼          ▼         ▼                ▼
  setOnline   [renew]    [renew]   [renew]          EXPIRED
  TTL=30m     TTL=30m    TTL=30m   TTL=30m       (auto-offline)

→ Mỗi action = implicit heartbeat. Không cần ping/pong riêng.
→ Mất mạng đột ngột? Không có renew → Redis auto-expire → offline.
```

### Graceful vs Ungraceful Disconnect

| | Graceful (tắt app) | Ungraceful (mất mạng) |
|---|---|---|
| **Signal** | Client gửi `disconnect` | Không có signal |
| **Xử lý** | Server gọi `setOffline()` ngay | Redis TTL tự expire sau 30 phút |
| **Độ trễ offline** | Tức thì | Tối đa 30 phút |

### Tại sao dùng Redis thay vì In-memory?

| Tiêu chí | In-memory Map | Redis ✅ |
|----------|---------------|----------|
| Server restart | ❌ Mất hết | ✅ Data còn |
| Shared state | ❌ Chỉ 1 process đọc | ✅ Mọi service đều query được |
| TTL tự động | ❌ Phải code cleanup | ✅ Native `EXPIRE` |
| Multi-instance | ❌ Cần rewrite | ✅ Ready to scale |

---

## 8. Xoá & Thu hồi tin nhắn

### So sánh

| | **Delete** (Xoá phía mình) | **Unsend** (Thu hồi) |
|---|---|---|
| **Scope** | Chỉ ẩn với người xoá | Ẩn với tất cả |
| **Thời hạn** | Không giới hạn | 24 giờ kể từ lúc gửi |
| **Cơ chế DB** | `deletedAt` ≠ null | `isUnsent = true`, `content = ''` |
| **Receiver thấy gì?** | Vẫn thấy bình thường | "Tin nhắn đã thu hồi" |
| **Khôi phục?** | Có thể | Không |

### Luồng thu hồi

```
1. Sender gửi yêu cầu unsend(messageId)
2. Verify: sender === message.senderId        → sai: 403 Forbidden
3. Check: now - message.timestamp < 24 giờ?   → quá hạn: 400 Bad Request
4. Update DB: isUnsent = true, content = '', attachments = null
5. Broadcast event 'messageUnsent' tới conversation room
6. Tất cả client hiển thị "Tin nhắn đã thu hồi"
```

---

## 9. Storage & Caching

### Phân bổ dữ liệu

```
┌────────────────┐              ┌──────────────────┐
│   Database     │              │   Cache (Redis)  │
│ (Source of     │              │                  │
│  Truth)        │              │ • Presence       │
│                │              │   (TTL: 30 min)  │
│ • Messages     │              │                  │
│ • Conversations│              │ • Session data   │
│ • Users        │              │   (TTL: config)  │
│                │              │                  │
│ Persistent     │              │ Ephemeral        │
│ Mất = MẤT DATA│              │ Mất = rebuild    │
│ → Backup!      │              │   từ DB          │
└────────────────┘              └──────────────────┘
```

### Chiến lược phân trang (Pagination)

Tin nhắn chat nên dùng **Cursor Pagination** thay vì Offset:

```
Offset: GET /messages?page=2&perPage=20
  ✗ Nếu có tin mới đến giữa chừng → bị duplicate hoặc skip

Cursor: GET /messages?cursor=<timestamp_cuối>&limit=20
  ✓ Ổn định dù có tin mới
  ✓ Hiệu năng tốt hơn với dataset lớn (không cần SKIP N rows)
```

### Index Strategy

| Query | Tần suất | Index |
|-------|----------|-------|
| Tin nhắn theo conversation | Rất cao | `(conversationId, timestamp)` |
| Conversations của user | Cao | `participantIds` |
| Presence check | Rất cao | Redis key lookup — O(1) |

---

## 10. Security

### Security Layers

```
Layer 1: Transport
  └── HTTPS/WSS (TLS encryption), CORS whitelist

Layer 2: Authentication
  ├── REST: JWT guard trên mỗi endpoint
  └── WebSocket: JWT verify tại handshake (trước khi accept connection)

Layer 3: Identity Enforcement
  └── senderId = token.userId (KHÔNG BAO GIỜ tin client gửi lên)

Layer 4: Authorization
  ├── User PHẢI thuộc conversation mới được join/send
  ├── Chỉ sender mới được thu hồi tin nhắn của mình
  └── Chỉ sender mới được xoá tin nhắn của mình

Layer 5: Input Validation
  └── Validate DTO, giới hạn content length
```

### Threat Model

| Mối đe doạ | Giải pháp |
|-----------|-----------|
| Giả mạo sender | sender luôn = JWT userId, bỏ qua payload client |
| Truy cập conversation không thuộc | Check `participantIds.includes(userId)` |
| JWT hết hạn trên WebSocket | Verify tại handshake, client reconnect với token mới |
| Zombie connections (mất mạng) | Redis TTL auto-expire |
| DDoS qua WebSocket | Rate limiting: sliding window counter |
| XSS qua nội dung tin nhắn | Sanitize content trước khi lưu |

---

## 11. Scalability

### Khi nào cần scale?

| Metric | Ngưỡng safe | Cần scale khi |
|--------|-------------|---------------|
| Concurrent WebSocket | ~50,000/instance | > 40,000 |
| Messages/s | ~5,000 writes/s | > 3,000 |
| API latency P99 | < 100ms | > 500ms |

### Scaling Roadmap

```
Stage 1: Startup (0 – 10K DAU)
┌──────────┐     ┌────────┐     ┌──────────┐
│  Single  │────▶│ Redis  │     │ Database │
│  Server  │     │ Single │     │ Single   │
└──────────┘     └────────┘     └──────────┘
  ✅ Đơn giản, dễ debug, ít moving parts


Stage 2: Growth (10K – 100K DAU)
┌──────────────┐
│ Load Balancer│     ┌────────┐     ┌──────────┐
│ (sticky      │────▶│ Redis  │     │ Database │
│  sessions)   │     │ + Pub/ │     │ Replica  │
│              │     │   Sub  │     │ Set      │
│ ┌────┐ ┌────┐│     └────────┘     └──────────┘
│ │ N1 │ │ N2 ││
│ └────┘ └────┘│     Cần Redis Adapter cho WebSocket
└──────────────┘     (sync events across instances)


Stage 3: Scale (100K+ DAU)
┌──────────┐  ┌──────────┐  ┌───────────────┐  ┌───────────────┐
│ API      │  │ WS       │  │ Redis         │  │ Database      │
│ Gateway  │  │ LB       │  │ Cluster       │  │ Sharded       │
│          │  │ (sticky) │  │               │  │               │
│ REST ──▶ │  │ WS ────▶ │  │ Pub/Sub +     │  │ Shard key:    │
│          │  │          │  │ Presence      │  │ conversationId│
└──────────┘  └──────────┘  └───────────────┘  └───────────────┘
```

### Mở rộng tính năng

| Tính năng | Hướng triển khai |
|-----------|-----------------|
| **Group Chat** | Thêm `type` ("direct" \| "group"), `name`, `adminIds` vào Conversation |
| **Push Notification** | Khi receiver offline → FCM/APNs |
| **Message Reactions** | Bảng riêng: `MessageReaction(userId, messageId, emoji)` |
| **Rate Limiting** | Redis sliding window: 60 msg/phút/user |
| **End-to-End Encryption** | Client-side encrypt, server chỉ lưu ciphertext |

---

## 12. Trade-offs

> Mọi quyết định thiết kế đều là trade-off. Điều quan trọng là biết mình đang đánh đổi gì.

| Quyết định | Được gì | Mất gì | Lý do chọn |
|-----------|---------|--------|------------|
| **WebSocket** vs Long Polling | Low latency, bidirectional | Stateful, khó scale | Realtime là core |
| **Persist before push** | Không mất tin nhắn | +5ms latency | Reliability > Speed |
| **NoSQL** vs SQL | Flexible schema, array queries | Weak transactions | Chat data = semi-structured |
| **Redis Presence** vs In-memory | Shared state, TTL, scale-ready | +1ms, thêm dependency | Đã cần Redis cho cache |
| **Tách WS port riêng** | Isolate traffic, dễ monitor | Client connect 2 endpoint | WS không ảnh hưởng REST |
| **Soft delete + isUnsent** | Audit trail, UX đồng bộ | Storage không giảm | UX quan trọng hơn |
| **readBy[]** vs isRead | Future-proof group chat | Thêm storage | Thiết kế cho tương lai |
| **Cursor pagination** | Ổn định, hiệu năng | Phức tạp hơn offset | Chat data liên tục thay đổi |

### Kiến trúc Pragmatic vs Lý tưởng

```
Pragmatic (nên chọn):               Lý tưởng (overkill nếu < 100K DAU):
┌─────────────────────┐              ┌────────────────────────────┐
│ Monolith            │              │ Chat Microservice          │
│ + WebSocket Gateway │              │ + Message Broker (Kafka)   │
│ + NoSQL             │              │ + Event Sourcing + CQRS    │
│ + Redis             │              │ + Dedicated WS cluster     │
│                     │              │                            │
│ ✅ Đơn giản          │              │ ❌ Over-engineering         │
│ ✅ Dễ debug          │              │ ❌ Phức tạp vận hành        │
│ ✅ Ship nhanh        │              │ ❌ Chưa cần                 │
└─────────────────────┘              └────────────────────────────┘

→ Scale khi CẦN, không phải khi CÓ THỂ.
```

---

## Tham khảo

- [Designing a Chat System — System Design Interview (ByteByteGo)](https://bytebytego.com)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [The Twelve-Factor App — Concurrency](https://12factor.net/concurrency)
