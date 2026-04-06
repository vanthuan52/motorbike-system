# Chat System — Design & Technical Reference

> **Phạm vi**: Chat module trong Motorbike System  
> **Stack**: NestJS · Socket.IO · MongoDB (Prisma) · Redis  
> **Cập nhật**: 02/04/2026

---

## Mục lục

**Part 1 — System Design**
1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Component Design](#3-component-design)
4. [Data Model](#4-data-model)
5. [Communication Protocol](#5-communication-protocol)
6. [Message Flows](#6-message-flows)
7. [Presence System](#7-presence-system)
8. [Storage & Caching](#8-storage--caching)
9. [Security](#9-security)
10. [Scalability](#10-scalability)
11. [Trade-offs](#11-trade-offs)

**Part 2 — Technical Reference**
12. [Module Structure](#12-module-structure)
13. [Database Schema](#13-database-schema)
14. [Domain Models & Enums](#14-domain-models--enums)
15. [WebSocket Events](#15-websocket-events)
16. [REST API](#16-rest-api)
17. [Frontend Integration](#17-frontend-integration)
18. [Deployment Checklist](#18-deployment-checklist)

---

# Part 1 — System Design

## 1. Yêu cầu hệ thống

### Functional Requirements

| ID | Yêu cầu | Priority |
|----|---------|----------|
| FR-1 | Gửi/nhận tin nhắn 1-1 realtime | P0 |
| FR-2 | Hỗ trợ text, image, video, file | P0 |
| FR-3 | Trạng thái: Sent → Delivered → Read | P0 |
| FR-4 | Lịch sử tin nhắn có phân trang | P0 |
| FR-5 | Quản lý hội thoại (tạo, liệt kê) | P0 |
| FR-6 | Typing indicator | P1 |
| FR-7 | Xoá tin nhắn (phía mình) | P1 |
| FR-8 | Thu hồi tin nhắn (tất cả, giới hạn 24h) | P1 |
| FR-9 | Presence: Online/Offline + Last seen | P1 |

### Non-Functional Requirements

| ID | Yêu cầu | Mục tiêu |
|----|---------|----------|
| NFR-1 | Latency | < 200ms end-to-end |
| NFR-2 | Reliability | Persist trước khi push, không mất tin |
| NFR-3 | Security | JWT auth, không giả mạo sender |
| NFR-4 | Ordering | Đúng thứ tự theo timestamp |
| NFR-5 | Consistency | Cùng conversation → cùng dữ liệu |

### Estimation (10K DAU)

```
Messages/day  : 10,000 × 20 = 200,000 msg/ngày
Messages/sec  : 200,000 / 86,400 ≈ 2.3 msg/s (avg), ~12 msg/s (peak)
Storage/day   : 200,000 × 500 bytes ≈ 100 MB
Storage/year  : ~36 GB
WS connections: ~2,000 concurrent (20% DAU)
```

→ **Single server + MongoDB + Redis đủ dùng.** Thiết kế đơn giản nhưng sẵn sàng scale.

---

## 2. High-Level Architecture

```
                        ┌─────────────┐
                        │   Clients   │
                        │ (Web/Mobile)│
                        └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        HTTP REST         WebSocket         File Upload
        (port 3000)       (port 5002)      (Media Module)
              │                │                │
      ┌───────┴──────┐  ┌──────┴───────┐  ┌────┴──────────┐
      │ REST          │  │  WebSocket   │  │  Media Module │
      │ Controllers   │  │  Gateway     │  │  (CDN URLs)   │
      └───────┬───────┘  └──────┬───────┘  └───────────────┘
              └────────┬─────────┘
                       │
             ┌─────────┴──────────┐
             │   Business Layer    │
             │  MessageService     │
             │  ConversationService│
             │  PresenceService ───┼──── Redis
             └─────────┬──────────┘
                       │
             ┌─────────┴──────────┐
             │   Data Layer        │
             │  Repositories       │
             │  Mappers            │
             └─────────┬──────────┘
                       │
                  ┌────┴─────┐
                  │  MongoDB  │
                  └───────────┘
```

### Phân tách giao thức

| Giao thức | Port | Dùng cho | Lý do |
|-----------|------|----------|-------|
| WebSocket | 5002 | Send/receive msg, typing, presence, delete/unsend | Realtime, bidirectional |
| HTTP REST | 3000 | Tạo conversation, lịch sử tin nhắn, update status | Stateless, cacheable, paginated |

### Design principle: **"Persist before push"**

```
1. Validate (JWT + participant check)
2. Persist to MongoDB   ← tin nhắn an toàn ở đây
3. Update conversation.lastMessageId
4. Broadcast via WebSocket
5. Auto-deliver nếu receiver online (check Redis)
```

---

## 3. Component Design

### Layer diagram

```
Gateway/Controllers  →  Services  →  Repositories  →  MongoDB
                                          ↑
                                       Mappers (Prisma Entity → Domain Model)
                              ↗
                       PresenceService → Redis
```

### Trách nhiệm từng layer

| Layer | Làm gì | KHÔNG làm gì |
|-------|--------|--------------|
| **Gateway** | Nhận WS events, gọi Service, broadcast | Truy cập DB, chứa business logic |
| **MessageService** | Validate rules, gọi Repository, quản lý state | Emit events, biết về Socket |
| **PresenceService** | Quản lý online/offline qua Redis | Broadcast events, quản lý connections |
| **Repository** | CRUD, map Prisma → Domain | Business rules, gọi Service khác |

### Dependency rule

```
Gateway → Service → Repository → DB
↑ DTOs      ↑ Domain Models  ↑ Prisma types

❌ Repository → Service (ngược chiều)
❌ Gateway → Repository (skip Service)
```

---

## 4. Data Model

### Entity Relationship

```
User ──1:N──► Message ──N:1──► User
                  │ N:1
                  ▼
            Conversation
            participantIds[] ──M:N──► User[]
```

### Thiết kế quan trọng

**Tại sao `readBy: String[]` thay vì `isRead: Boolean`?**
- Biết chính xác ai đã đọc
- Sẵn sàng cho group chat ("2/5 người đã xem")

**Tại sao `lastMessageId` denormalized trong Conversation?**
- Tránh N+1 query khi list conversations
- Trade-off: thêm 1 write khi gửi tin (chấp nhận được vì read >> write)

**Tại sao `isUnsent=true + content=''` thay vì hard delete?**
- Client biết để hiển thị "Tin nhắn đã thu hồi"
- Giữ audit trail (ai gửi, thời điểm nào)
- Đồng bộ trên tất cả clients

### Index strategy

```
messages:
  ├── conversationId  (lấy tin nhắn theo conversation)
  ├── senderId        (filter cho delete/unsend)
  ├── receiverId
  └── timestamp       (ORDER BY cho pagination)

conversations:
  └── participantIds  (tìm conversation của user)
```

---

## 5. Communication Protocol

### WebSocket Lifecycle

```
Client                              Server
  │── TCP + HTTP Upgrade ──────────►│
  │   auth: { token: JWT }          │
  │                                 │── WsJwtGuard.canActivate()
  │                                 │   verify JWT → attach userId to socket.data
  │◄── 101 Switching Protocols ─────│
  │                                 │── handleConnection()
  │                                 │   PresenceService.setOnline(userId)
  │                                 │   broadcast: userStatus { isOnline: true }
  │── joinConversation ────────────►│── join Socket.IO room
  │◄── joinedConversation ──────────│
  │         ... bidirectional ...   │
  │── disconnect ──────────────────►│── handleDisconnect()
  │                                 │   PresenceService.setOffline(userId)
  │                                 │   broadcast: userStatus { isOnline: false }
```

### Socket.IO Room Pattern

```
Room = conversationId

Room "conv_abc":
  ├── Socket A (User A)
  └── Socket B (User B)

server.to("conv_abc").emit(...)       → tất cả trong room
client.broadcast.to("conv_abc").emit  → tất cả TRỪ sender (dùng cho typing)
```

---

## 6. Message Flows

### Happy path (cả 2 online)

```
User A                  Server              Redis       MongoDB    User B
  │── sendMessage ──────►│                                           │
  │                      │── validate JWT + participant              │
  │                      │── save message ──────────────────────────►│
  │                      │── update lastMessageId ──────────────────►│
  │◄─ newMessage ─────────│──────────────────────────────────────────►│
  │                      │── check presence ──►│isOnline: true       │
  │                      │── mark delivered ───────────────────────► │
  │◄─ messageDelivered ───│──────────────────────────────────────────►│
```

### Receiver offline

```
  Giống trên nhưng:
  check presence → isOnline: false
  → Status giữ nguyên "sent"
  → [Future] Push notification qua FCM/APNs

  Khi User B online lại:
  → GET /messages (history, status=sent)
  → emit readMessage → status = "read"
  → User A nhận messageRead event
```

### Message State Machine

```
            SENT ──[receiver online]──► DELIVERED ──[readMessage]──► READ

Invariant: Chỉ đi tiến, không bao giờ lùi (READ → DELIVERED ❌)

Sent → Delivered : Tự động, khi receiver đang online
Delivered → Read : Receiver emit readMessage
Sent → Read      : Có thể bỏ qua Delivered nếu đọc ngay
```

### Unsend Flow

```
emit unsendMessage
  → sender === JWT userId?  No → ForbiddenException
  → timestamp < 24h?        No → "unsendTimeLimitExceeded"
  → DB: isUnsent=true, content='', attachments=null
  → broadcast "messageUnsent" to room
```

### Delete vs Unsend

| | Delete (xoá phía mình) | Unsend (thu hồi) |
|---|---|---|
| Ai thấy? | Chỉ ẩn với sender | Ẩn với tất cả |
| Thời hạn | Không giới hạn | 24h kể từ lúc gửi |
| Cơ chế DB | `deletedAt ≠ null` | `isUnsent=true, content=''` |
| Receiver thấy | Vẫn thấy bình thường | "Tin nhắn đã thu hồi" |

---

## 7. Presence System

### Architecture

```
Redis:
  Key: "presence:{userId}"
  Value: { socketId, connectedAt }
  TTL: 30 phút (auto-expire nếu không renew)
```

### Methods

| Method | Khi nào |
|--------|---------|
| `setOnline(userId, socketId)` | handleConnection |
| `setOffline(userId)` | handleDisconnect |
| `isOnline(userId)` | Trước khi mark delivered |
| `renewPresence(userId)` | Mỗi action (send, type...) |
| `getOnlineUsers(userIds[])` | Batch check |

### TTL Strategy

```
connect() → setOnline (TTL=30m)
  sendMsg → renewPresence (TTL=30m reset)
  typing  → renewPresence (TTL=30m reset)
  ...
  [mất mạng đột ngột] → không renew → Redis auto-expire → user offline
```

Mỗi action = implicit heartbeat. Không cần ping/pong riêng.

### Graceful vs Ungraceful disconnect

| | Graceful (tắt app) | Ungraceful (mất mạng) |
|---|---|---|
| Cơ chế | `handleDisconnect()` → `setOffline()` | Redis TTL tự expire sau 30m |
| Tốc độ offline | Ngay lập tức | Sau ~30 phút |

### Tại sao Redis thay vì In-memory Map?

| Tiêu chí | In-memory | Redis ✅ |
|----------|-----------|---------|
| Server restart | Mất hết | Vẫn còn |
| Multi-instance | Không share | Shared state |
| TTL auto-expire | Phải tự code | Built-in |
| Đọc từ module khác | Không được | Được |

---

## 8. Storage & Caching

```
MongoDB (Source of Truth)    Redis (Hot data + Ephemeral state)
  • messages                   • presence:{userId}  TTL 30m
  • conversations              • session cache      TTL config
  • users                      • app cache          TTL 5m

Nguyên tắc:
  Mất Redis → rebuild được từ MongoDB
  Mất MongoDB → MẤT DATA (backup bắt buộc)
```

### Pagination cho tin nhắn

- **Offset pagination**: `GET /messages?page=2&perPage=20` — đơn giản, dùng được
- **Cursor pagination**: `GET /messages?cursor=<timestamp>` — ưu tiên hơn, tránh duplicate khi có tin mới đến giữa chừng
- Luôn ORDER BY timestamp DESC (tin mới nhất → cũ nhất)

---

## 9. Security

### Các lớp bảo mật

```
Layer 1 — Transport     : HTTPS/WSS, CORS whitelist
Layer 2 — Authn         : JWT verify tại handshake (WsJwtGuard) + REST decorator
Layer 3 — Identity      : senderId = JWT payload.userId (KHÔNG tin client payload)
Layer 4 — Authz         : participant check, chỉ sender mới delete/unsend
Layer 5 — Input         : class-validator DTOs, content length limits
```

### Threat Model

| Threat | Giải pháp | Trạng thái |
|--------|-----------|-----------|
| Giả mạo sender | sender = JWT userId, bỏ qua payload client | ✅ Done |
| Truy cập conversation không thuộc | `participantIds.includes(userId)` | ✅ Done |
| JWT hết hạn trên WS | WsJwtGuard verify tại handshake; reconnect khi token mới | ✅ Done |
| Replay attack | JTI rotation trong refresh token flow | ✅ Done |
| Zombie connections | Redis TTL 30m | ✅ Done |
| DDoS qua WebSocket | Rate limiting | ⚠️ TODO |
| XSS qua nội dung tin | Content sanitization | ⚠️ TODO |

---

## 10. Scalability

### Current state (0–10K DAU)

```
Single NestJS ──► Redis (single) ──► MongoDB (single)
~2,000 WS connections = 4% capacity → Chưa cần scale
```

### Scaling roadmap

```
Stage 2 (10K–100K DAU):
  Load Balancer (sticky sessions)
  → [Node1, Node2, Node3]
  → Redis Adapter for Socket.IO (sync events across instances)
  → MongoDB Replica Set

Stage 3 (100K+ DAU):
  API GW + WS LB (sticky)
  → Redis Cluster
  → MongoDB Sharded (shard key: conversationId)
```

### Ngưỡng cần scale

| Metric | Hiện tại | Scale khi |
|--------|----------|-----------|
| Concurrent WS | ~2,000 | > 40,000 → thêm instance + Redis Adapter |
| Messages/s | ~2.3 | > 3,000 → MongoDB sharding |
| Presence queries/s | ~10 | > 10,000 → Redis Cluster |
| API latency P99 | ~50ms | > 500ms → horizontal scale |

---

## 11. Trade-offs

| Quyết định | Pros | Cons | Lý do chọn |
|-----------|------|------|------------|
| WebSocket thay vì Long Polling | Low latency, bidirectional | Stateful, khó scale | Realtime là yêu cầu core |
| MongoDB thay vì PostgreSQL | Flexible schema, array queries | Weak transactions | Chat data semi-structured |
| Persist before push | Không mất tin nhắn | Thêm ~5ms latency | Reliability > Speed |
| Redis Presence | Persist qua restart, shared | Thêm dependency | Đã có Redis trong stack |
| Port 5002 riêng cho WS | Isolate traffic, dễ monitor | Client connect 2 endpoints | Tránh WS ảnh hưởng REST |
| Soft delete + isUnsent | Audit trail, UX đồng bộ | Không giảm storage | UX + traceability quan trọng hơn |
| readBy[] thay vì isRead | Sẵn sàng group chat | Thêm storage | Future-proof |
| 24h unsend limit | Tương tự Zalo/Messenger | User không thích | Cân bằng privacy sender vs receiver |
| Monolith thay vì Microservice | Đơn giản, dễ debug, ít moving parts | Khó split sau | Phù hợp scale hiện tại (10K DAU) |

---

---

# Part 2 — Technical Reference

## 12. Module Structure

```
src/modules/chat/
├── chat.gateway.ts                    # WebSocket Gateway (realtime)
├── chat.module.ts                     # NestJS module definition
│
├── controllers/
│   ├── conversation.controller.ts     # REST: Quản lý hội thoại
│   └── message.controller.ts          # REST: Lịch sử, cập nhật trạng thái
│
├── services/
│   ├── message.service.ts             # Business logic tin nhắn
│   ├── conversation.service.ts        # Business logic hội thoại
│   └── presence.service.ts            # Online/offline via Redis
│
├── repository/
│   ├── message.repository.ts
│   └── conversation.repository.ts
│
├── models/                            # Domain models (Prisma-independent)
│   ├── message.model.ts
│   └── conversation.model.ts
│
├── mappers/                           # Prisma Entity → Domain Model
│   ├── message.mapper.ts
│   └── conversation.mapper.ts
│
├── guards/
│   └── ws-jwt.guard.ts                # JWT auth cho WebSocket handshake
│
├── dtos/
│   ├── request/                       # SendMessageDto, ReadMessageDto, ...
│   └── response/                      # MessageResponseDto, ...
│
├── enums/
│   ├── message.enum.ts                # EnumMessageType, EnumMessageStatus
│   ├── message.gateway-events.enum.ts
│   └── message-status-code.enum.ts
│
├── interfaces/
├── docs/                              # Swagger decorators
├── constants/
└── utils/socket-error.util.ts
```

### Module registration

```typescript
@Module({
  imports: [UserModule, AuthModule],
  controllers: [ConversationController, MessageSharedController],
  providers: [
    MessageService, ConversationService, PresenceService,
    MessageRepository, ConversationRepository,
    MessageGateway, WsJwtGuard,
  ],
  exports: [MessageService, ConversationService, PresenceService],
})
export class ChatModule {}
```

---

## 13. Database Schema

```prisma
model Conversation {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  participantIds String[]  @db.ObjectId   // [userId1, userId2]
  lastMessageId  String?   @db.ObjectId   // Denormalized để tránh N+1
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?

  messages Message[]

  @@index([participantIds])
  @@map("conversations")
}

model Message {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  content        String
  messageType    String    @default("text")   // text | image | video | file
  timestamp      DateTime  @default(now())
  status         String    @default("sent")   // sent | delivered | read
  readBy         String[]  @db.ObjectId       // Ai đã đọc
  isUnsent       Boolean   @default(false)
  attachments    Json?                         // IMessageAttachment[]

  conversationId String    @db.ObjectId
  senderId       String    @db.ObjectId
  receiverId     String    @db.ObjectId

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?

  @@index([conversationId])
  @@index([senderId])
  @@index([receiverId])
  @@index([timestamp])
  @@map("messages")
}
```

---

## 14. Domain Models & Enums

```typescript
// Domain models (độc lập với Prisma)
class MessageModel {
  id: string;
  content: string;
  messageType: EnumMessageType;   // text | image | video | file
  timestamp: Date;
  status: EnumMessageStatus;      // sent | delivered | read
  readBy: string[];
  isUnsent: boolean;
  attachments?: IMessageAttachment[];
  conversationId: string;
  senderId: string;
  receiverId: string;
  sender?: UserModel;             // populated khi cần
  receiver?: UserModel;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

class ConversationModel {
  id: string;
  participantIds: string[];
  lastMessageId?: string;
  messages?: MessageModel[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface IMessageAttachment {
  url: string;          // URL CDN từ Media Module
  filename: string;
  mimeType: string;     // "image/jpeg", "video/mp4", ...
  size: number;         // bytes
  thumbnailUrl?: string;
}

enum EnumMessageType {
  text = 'text',
  image = 'image',
  video = 'video',
  file = 'file',
}

enum EnumMessageStatus {
  sent = 'sent',           // Đã lưu DB
  delivered = 'delivered', // Receiver đang online, đã nhận
  read = 'read',           // Receiver đã xem
}

enum EnumChatStatusCodeError {
  notFound = 6200,
  invalidConversation = 6201,   // Conversation không tồn tại
  messageNotFound = 6202,
  missingUserId = 6203,         // JWT không có userId
  notAuthorized = 6204,         // Delete/unsend của người khác
  unsendTimeLimitExceeded = 6205 // Quá 24h
}
```

---

## 15. WebSocket Events

**Kết nối**: `ws://localhost:5002` — JWT bắt buộc qua `auth.token`

```javascript
const socket = io('http://localhost:5002', {
  auth: { token: '<JWT_ACCESS_TOKEN>' }
});
```

### Client → Server

| Event | Payload | Mô tả |
|-------|---------|-------|
| `joinConversation` | `{ conversationId }` | Tham gia room |
| `leaveConversation` | `{ conversationId }` | Rời room |
| `sendMessage` | `{ conversation, receiver, content, messageType, attachments? }` | Gửi tin nhắn |
| `readMessage` | `{ conversationId, messageId }` | Đánh dấu đã đọc |
| `typing` | `{ conversationId, isTyping }` | Typing indicator |
| `deleteMessage` | `{ messageId, conversationId }` | Xoá phía mình |
| `unsendMessage` | `{ messageId, conversationId }` | Thu hồi cho tất cả |

> **Lưu ý**: `sender` KHÔNG có trong payload — server tự lấy từ JWT.

### Server → Client

| Event | Payload | Khi nào |
|-------|---------|---------|
| `joinedConversation` | `{ conversationId }` | Xác nhận join room |
| `newMessage` | `MessageModel` | Có tin nhắn mới |
| `messageDelivered` | `{ messageId, conversationId }` | Tin đã tới receiver |
| `messageRead` | `{ messageId, conversationId, readerId }` | Tin đã được đọc |
| `typingStatus` | `{ conversationId, userId, isTyping }` | Ai đó đang gõ |
| `messageDeleted` | `{ messageId, conversationId, deletedBy, scope }` | Tin đã bị xoá |
| `messageUnsent` | `{ messageId, conversationId, unsentBy }` | Tin đã thu hồi |
| `userStatus` | `{ userId, isOnline, lastSeenAt? }` | Online/Offline |
| `error` | `{ code, message }` | Lỗi (code từ EnumChatStatusCodeError) |

### Error handling trên Client

| Code | Tên | Client nên làm |
|------|-----|----------------|
| 6201 | `invalidConversation` | Redirect về danh sách chat |
| 6203 | `missingUserId` | Force re-login |
| 6204 | `notAuthorized` | Hiển thị "Không có quyền" |
| 6205 | `unsendTimeLimitExceeded` | Hiển thị "Đã quá thời hạn" |

---

## 16. REST API

### Conversation

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/v1/conversations/get` | Danh sách conversation của user | JWT |
| `POST` | `/v1/conversations/create` | Tạo hoặc lấy conversation giữa 2 user | JWT |

**POST /v1/conversations/create** — Logic: nếu đã tồn tại → trả về ID cũ; nếu chưa → tạo mới.

```json
// Request
{ "sender": "userId1", "receiver": "userId2" }

// Response
{ "data": { "id": "665a1b..." } }
```

### Message

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/v1/messages/:conversationId/messages` | Lịch sử tin nhắn (paginated) | JWT |
| `PUT` | `/v1/messages/:messageId/status` | Cập nhật trạng thái tin nhắn | JWT |

**Query params** cho GET: `page`, `perPage`, `orderBy`, `orderDirection`

---

## 17. Frontend Integration

### Setup socket

```javascript
// chat.socket.js
import { io } from 'socket.io-client';

export function createChatSocket(accessToken) {
  const socket = io('http://localhost:5002', {
    auth: { token: accessToken },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect_error', (err) => {
    // Token hết hạn → refresh token → reconnect
    console.error('Connection failed:', err.message);
  });

  socket.on('error', ({ code, message }) => {
    console.error(`Chat error [${code}]:`, message);
  });

  return socket;
}
```

### Gửi và nhận tin nhắn

```javascript
// Gửi (sender KHÔNG cần truyền, server tự lấy từ JWT)
socket.emit('sendMessage', {
  conversation: conversationId,
  receiver: receiverId,
  content: 'Hello',
  messageType: 'text',
});

// Nhận
socket.on('newMessage', (message) => addMessageToUI(message));
socket.on('messageDelivered', ({ messageId }) => updateStatus(messageId, 'delivered'));
socket.on('messageRead', ({ messageId }) => updateStatus(messageId, 'read'));
```

### Typing indicator

```javascript
let typingTimeout;

function handleInputChange(socket, conversationId) {
  socket.emit('typing', { conversationId, isTyping: true });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { conversationId, isTyping: false });
  }, 3000); // Auto-stop sau 3 giây không gõ
}

socket.on('typingStatus', ({ userId, isTyping }) => {
  isTyping ? showTypingIndicator(userId) : hideTypingIndicator(userId);
});
```

### Presence

```javascript
socket.on('userStatus', ({ userId, isOnline, lastSeenAt }) => {
  isOnline ? showOnlineBadge(userId) : showLastSeen(userId, lastSeenAt);
});
```

### Thu hồi tin nhắn

```javascript
socket.emit('unsendMessage', { messageId, conversationId });
socket.on('messageUnsent', ({ messageId }) => {
  replaceMessageContent(messageId, 'Tin nhắn đã thu hồi');
});
```

---

## 18. Deployment Checklist

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Sync schema với MongoDB
npx prisma db push

# 3. Build kiểm tra TypeScript
npm run build
```

### Environment variables

```env
DATABASE_URL=mongodb://...
CACHE_REDIS_URL=redis://localhost:6379
QUEUE_REDIS_URL=redis://localhost:6379
# WebSocket port 5002 (config trong chat.gateway.ts)
```

### Test WebSocket nhanh

```bash
node -e "
  const io = require('socket.io-client');
  const s = io('http://localhost:5002', { auth: { token: 'YOUR_JWT' } });
  s.on('connect', () => console.log('Connected!', s.id));
  s.on('error', (e) => console.log('Error:', e));
"
```

---

## Tham khảo

- [Socket.IO Docs](https://socket.io/docs/v4/)
- [NestJS WebSocket Gateway](https://docs.nestjs.com/websockets/gateways)
- [System Design — Chat System (ByteByteGo)](https://bytebytego.com)
- [Prisma + MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
