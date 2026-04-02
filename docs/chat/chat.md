# Chat Module — Tài liệu Kỹ thuật

> **Module**: `src/modules/chat`
> **Phiên bản**: 2.0 (Refactored)
> **Cập nhật**: 02/04/2026

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Kiến trúc Module](#2-kiến-trúc-module)
3. [Database Schema](#3-database-schema)
4. [Domain Models](#4-domain-models)
5. [WebSocket Gateway](#5-websocket-gateway)
6. [REST API Endpoints](#6-rest-api-endpoints)
7. [Luồng nghiệp vụ chi tiết](#7-luồng-nghiệp-vụ-chi-tiết)
8. [Hướng dẫn tích hợp Frontend](#8-hướng-dẫn-tích-hợp-frontend)
9. [Mở rộng & Nâng cấp](#9-mở-rộng--nâng-cấp)

---

## 1. Tổng quan

### Chat Module là gì?

Chat Module cung cấp chức năng nhắn tin **thời gian thực** (realtime) giữa các người dùng trong hệ thống. Module này được xây dựng theo **kiến trúc Clean Architecture + DDD** (Domain-Driven Design), tách biệt hoàn toàn giữa tầng Presentation, Business Logic và Data Access.

### Tính năng chính

| Tính năng | Mô tả | Giao thức |
|-----------|-------|-----------|
| **Gửi/Nhận tin nhắn** | Hỗ trợ text, image, video, file | WebSocket |
| **Trạng thái tin nhắn** | Sent → Delivered → Read | WebSocket |
| **Typing Indicator** | Hiển thị khi người khác đang nhập liệu | WebSocket |
| **Xoá tin nhắn** | Xoá phía người gửi (soft delete) | WebSocket |
| **Thu hồi tin nhắn** | Thu hồi cho tất cả (trong 24h) | WebSocket |
| **Quản lý hội thoại** | Tạo, lấy danh sách conversations | REST API |
| **Presence** | Online/Offline, Last Seen | WebSocket |
| **Lịch sử tin nhắn** | Cursor/Offset pagination | REST API |

### Tech Stack

- **Backend Framework**: NestJS
- **Realtime**: Socket.IO (WebSocket Gateway, port `5002`)
- **Database**: MongoDB (Prisma ORM)
- **Authentication**: JWT (Access Token)

---

## 2. Kiến trúc Module

### Cấu trúc thư mục

```
chat/
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
│   └── presence.service.ts            # Quản lý trạng thái online/offline
│
├── repository/
│   ├── message.repository.ts          # Data access tin nhắn
│   └── conversation.repository.ts     # Data access hội thoại
│
├── models/
│   ├── message.model.ts               # Domain model: MessageModel
│   └── conversation.model.ts          # Domain model: ConversationModel
│
├── mappers/
│   ├── message.mapper.ts              # Prisma Entity → Domain Model
│   └── conversation.mapper.ts         # Prisma Entity → Domain Model
│
├── guards/
│   └── ws-jwt.guard.ts                # JWT authentication cho WebSocket
│
├── interfaces/
│   ├── message.service.interface.ts   # Contract của MessageService
│   ├── conversation.service.interface.ts
│   ├── message-attachment.interface.ts
│   ├── message.interface.ts
│   └── conversation.interface.ts
│
├── enums/
│   ├── message.enum.ts                # EnumMessageType, EnumMessageStatus
│   ├── message.gateway-events.enum.ts # Tên các WebSocket events
│   └── message-status-code.enum.ts    # Error codes
│
├── dtos/
│   ├── request/
│   │   ├── send-message.dto.ts
│   │   ├── read-message.dto.ts
│   │   ├── join-conversation.dto.ts
│   │   ├── conversation-create-request.dto.ts
│   │   └── message-update-status.request.dto.ts
│   └── response/
│       ├── message-response.dto.ts
│       └── get-conversation-response.dto.ts
│
├── docs/                              # Swagger documentation decorators
├── constants/
└── utils/
    └── socket-error.util.ts
```

### Sơ đồ lớp (Layer Diagram)

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│                                                          │
│  ┌──────────────────┐    ┌────────────────────────────┐  │
│  │  REST Controllers │    │   WebSocket Gateway        │  │
│  │  (HTTP endpoints) │    │   (Realtime events)        │  │
│  └────────┬─────────┘    └────────────┬───────────────┘  │
│           │                           │                   │
│           │  DTOs/Response DTOs       │  DTOs             │
│           │  ↕                        │  ↕                │
├───────────┼───────────────────────────┼───────────────────┤
│           │      BUSINESS LAYER       │                   │
│           ▼                           ▼                   │
│  ┌────────────────┐  ┌──────────────────┐  ┌──────────┐  │
│  │ Conversation   │  │  MessageService  │  │ Presence │  │
│  │ Service        │  │                  │  │ Service  │  │
│  └───────┬────────┘  └────────┬─────────┘  └──────────┘  │
│          │                    │                            │
│          │  Domain Models     │  Domain Models             │
│          │  ↕                 │  ↕                         │
├──────────┼────────────────────┼────────────────────────────┤
│          │   DATA ACCESS LAYER│                            │
│          ▼                    ▼                            │
│  ┌────────────────┐  ┌─────────────────┐                  │
│  │ Conversation   │  │ Message         │                  │
│  │ Repository     │  │ Repository      │  ← Prisma ORM   │
│  └────────────────┘  └─────────────────┘                  │
│          │                    │                            │
│          │  Mappers           │  Mappers                   │
│          ▼                    ▼                            │
│  ┌────────────────────────────────────────┐               │
│  │          MongoDB (Prisma Client)       │               │
│  └────────────────────────────────────────┘               │
└───────────────────────────────────────────────────────────┘
```

### Module Dependencies

```typescript
// chat.module.ts
@Module({
  imports: [UserModule, AuthModule],       // Module phụ thuộc
  controllers: [
    ConversationController,                // REST
    MessageSharedController,               // REST
  ],
  providers: [
    MessageService, ConversationService, PresenceService,  // Services
    MessageRepository, ConversationRepository,             // Repositories
    MessageGateway, WsJwtGuard,                            // Gateway + Auth
  ],
  exports: [MessageService, ConversationService, PresenceService],
})
export class ChatModule {}
```

---

## 3. Database Schema

### Conversation

```prisma
model Conversation {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  participantIds String[]  @db.ObjectId     // Danh sách userId tham gia
  lastMessageId  String?   @db.ObjectId     // ID tin nhắn cuối
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?                  // Soft delete

  createdBy      String?   @db.ObjectId
  updatedBy      String?   @db.ObjectId
  deletedBy      String?   @db.ObjectId

  messages Message[]

  @@index([participantIds])
  @@map("conversations")
}
```

### Message

```prisma
model Message {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  content     String                        // Nội dung text
  messageType String    @default("text")    // text | image | video | file
  timestamp   DateTime  @default(now())     // Thời điểm gửi
  status      String    @default("sent")    // sent | delivered | read
  readBy      String[]  @db.ObjectId        // Danh sách userId đã đọc
  isUnsent    Boolean   @default(false)     // Đã thu hồi?
  attachments Json?                         // Metadata file đính kèm
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?                     // Soft delete

  createdBy   String?   @db.ObjectId
  updatedBy   String?   @db.ObjectId
  deletedBy   String?   @db.ObjectId

  conversationId String       @db.ObjectId
  senderId       String       @db.ObjectId
  receiverId     String       @db.ObjectId

  @@index([conversationId])
  @@index([senderId])
  @@index([receiverId])
  @@index([timestamp])
  @@map("messages")
}
```

### Entity Relationship

```
┌───────────┐       ┌──────────────────┐       ┌───────────┐
│   User    │──1:N──│    Message       │──N:1──│   User    │
│ (sender)  │       │                  │       │(receiver) │
└───────────┘       └────────┬─────────┘       └───────────┘
                             │ N:1
                    ┌────────┴─────────┐
                    │  Conversation    │
                    │                  │
                    │ participantIds[] │── M:N ── User[]
                    └──────────────────┘
```

---

## 4. Domain Models

### MessageModel

```typescript
class MessageModel {
  id: string;
  content: string;
  messageType: EnumMessageType;     // text | image | video | file
  timestamp: Date;
  status: EnumMessageStatus;        // sent | delivered | read
  readBy: string[];
  isUnsent: boolean;
  attachments?: IMessageAttachment[];

  conversationId: string;
  conversation?: ConversationModel;
  senderId: string;
  sender?: UserModel;              // Populated khi include
  receiverId: string;
  receiver?: UserModel;            // Populated khi include

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### ConversationModel

```typescript
class ConversationModel {
  id: string;
  participantIds: string[];
  lastMessageId?: string;
  messages?: MessageModel[];        // Populated khi include

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### IMessageAttachment

```typescript
interface IMessageAttachment {
  url: string;           // URL tới file (từ Media Module)
  filename: string;      // Tên file gốc
  mimeType: string;      // "image/png", "video/mp4", ...
  size: number;          // Kích thước (bytes)
  thumbnailUrl?: string; // Thumbnail cho image/video
}
```

### Enums

```typescript
enum EnumMessageType {
  text = 'text',
  image = 'image',
  video = 'video',
  file = 'file',
}

enum EnumMessageStatus {
  sent = 'sent',           // Đã lưu vào DB
  delivered = 'delivered', // Receiver đang online, đã nhận event
  read = 'read',           // Receiver đã xem
}
```

---

## 5. WebSocket Gateway

### Kết nối

- **Port**: `5002`
- **CORS**: `origin: '*'` (cần config lại cho production)
- **Authentication**: JWT Access Token (bắt buộc)

### Cách kết nối từ Client

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5002', {
  auth: {
    token: '<JWT_ACCESS_TOKEN>'   // ← Bắt buộc
  }
});

// Hoặc qua Authorization header:
const socket = io('http://localhost:5002', {
  extraHeaders: {
    Authorization: 'Bearer <JWT_ACCESS_TOKEN>'
  }
});
```

> **Lưu ý bảo mật**: Gateway sử dụng `WsJwtGuard` để verify JWT token. Nếu không có token hoặc token không hợp lệ, connection sẽ bị từ chối (`client.disconnect()`). UserId được extract từ JWT payload, KHÔNG phải từ client payload.

### Bảng tổng hợp Events

#### Client → Server (gửi lên)

| Event | Payload | Mô tả |
|-------|---------|-------|
| `joinConversation` | `{ conversationId }` | Tham gia room của hội thoại |
| `leaveConversation` | `{ conversationId }` | Rời room |
| `sendMessage` | `{ conversation, receiver, content, messageType, attachments? }` | Gửi tin nhắn |
| `readMessage` | `{ conversationId, messageId }` | Đánh dấu đã đọc |
| `typing` | `{ conversationId, isTyping }` | Bắt đầu/ngừng soạn thảo |
| `deleteMessage` | `{ messageId, conversationId }` | Xoá tin nhắn (phía mình) |
| `unsendMessage` | `{ messageId, conversationId }` | Thu hồi tin nhắn (cho tất cả) |

#### Server → Client (nhận về)

| Event | Payload | Khi nào? |
|-------|---------|----------|
| `joinedConversation` | `{ conversationId }` | Xác nhận đã join room |
| `newMessage` | `MessageModel` (full object) | Có tin nhắn mới trong room |
| `messageDelivered` | `{ messageId, conversationId }` | Tin nhắn đã tới receiver |
| `messageRead` | `{ messageId, conversationId, readerId }` | Tin nhắn đã được đọc |
| `typingStatus` | `{ conversationId, userId, isTyping }` | Ai đó đang soạn thảo |
| `messageDeleted` | `{ messageId, conversationId, deletedBy, scope }` | Tin nhắn đã bị xoá |
| `messageUnsent` | `{ messageId, conversationId, unsentBy }` | Tin nhắn đã bị thu hồi |
| `userStatus` | `{ userId, isOnline, lastSeenAt? }` | Trạng thái online/offline |
| `error` | `{ code, message }` | Có lỗi xảy ra |

### Error Codes

```typescript
enum EnumChatStatusCodeError {
  notFound = 6200,
  invalidConversation = 6201,    // Conversation không tồn tại
  messageNotFound = 6202,        // Message không tồn tại
  missingUserId = 6203,          // Thiếu User ID
  notAuthorized = 6204,          // Không có quyền thực hiện
  unsendTimeLimitExceeded = 6205 // Quá thời hạn thu hồi (24 giờ)
}
```

---

## 6. REST API Endpoints

### Conversation

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/v1/conversations/get` | Lấy danh sách hội thoại của user | JWT Access |
| `POST` | `/v1/conversations/create` | Tạo hoặc lấy hội thoại giữa 2 user | JWT Access |

#### `GET /v1/conversations/get`

**Response**:
```json
{
  "data": [
    {
      "id": "665a1b...",
      "participants": ["userId1", "userId2"],
      "lastMessage": "665a2c...",
      "createdAt": "2026-04-02T10:00:00Z",
      "updatedAt": "2026-04-02T15:30:00Z"
    }
  ]
}
```

#### `POST /v1/conversations/create`

**Request Body**:
```json
{
  "sender": "userId1",
  "receiver": "userId2"
}
```

**Response**:
```json
{
  "data": {
    "id": "665a1b..."
  }
}
```

> **Logic**: Nếu đã tồn tại conversation giữa 2 user, trả về ID cũ. Nếu chưa, tạo mới.

### Message

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/v1/messages/:conversationId/messages` | Lịch sử tin nhắn (paginated) | JWT Access |
| `PUT` | `/v1/messages/:messageId/status` | Cập nhật trạng thái tin nhắn | JWT Access |

#### `GET /v1/messages/:conversationId/messages`

Hỗ trợ **offset pagination** với query params: `page`, `perPage`, `orderBy`, `orderDirection`.

---

## 7. Luồng nghiệp vụ chi tiết

### 7.1 Luồng gửi tin nhắn

```
 Client A (Sender)              Server                    Client B (Receiver)
      │                           │                             │
      │  emit('sendMessage', {    │                             │
      │    conversation, receiver,│                             │
      │    content, messageType   │                             │
      │  })                       │                             │
      │ ─────────────────────────>│                             │
      │                           │  1. Validate JWT (WsJwtGuard)
      │                           │  2. Enforce sender = JWT userId
      │                           │  3. Verify conversation exists
      │                           │  4. Verify sender is participant
      │                           │  5. Save message to DB (status=sent)
      │                           │  6. Update conversation.lastMessageId
      │                           │                             │
      │  emit('newMessage', msg)  │  emit('newMessage', msg)    │
      │ <─────────────────────────│─────────────────────────────>
      │                           │                             │
      │                           │  7. Check if receiver online
      │                           │     (PresenceService)       │
      │                           │  8. If online: update status│
      │                           │     → 'delivered'           │
      │ emit('messageDelivered')  │ emit('messageDelivered')    │
      │ <─────────────────────────│─────────────────────────────>
```

### 7.2 Luồng trạng thái tin nhắn

```
    Sent ──────────────> Delivered ────────────> Read
     │                      │                     │
     │ Tin nhắn lưu DB      │ Receiver online     │ Receiver gửi
     │ thành công            │ (auto)              │ readMessage event
     │                      │                     │
     └──────────────────────┴─────────────────────┘
              ↑ Không thể quay ngược trạng thái
```

**Quy tắc chuyển trạng thái:**
- `Sent` → `Delivered`: **Tự động** khi receiver đang online (qua `PresenceService.isOnline()`)
- `Delivered` → `Read`: Khi receiver gửi event `readMessage`
- `Sent` → `Read`: Có thể bỏ qua Delivered nếu receiver đọc ngay
- **KHÔNG** cho phép hạ cấp (Read → Delivered → Sent)

### 7.3 Luồng thu hồi tin nhắn (Unsend)

```
 Client A (Sender)              Server
      │                           │
      │  emit('unsendMessage', {  │
      │    messageId,             │
      │    conversationId         │
      │  })                       │
      │ ─────────────────────────>│
      │                           │   1. Tìm message bằng ID
      │                           │   2. Verify: sender === JWT userId
      │                           │   3. Check: timestamp < 24 giờ?
      │                           │      ├── Nếu quá hạn → emit error
      │                           │      └── Nếu còn hạn:
      │                           │          - isUnsent = true
      │                           │          - content = ''
      │                           │          - attachments = null
      │                           │
      │                           │   4. Broadcast 'messageUnsent'
      │  emit('messageUnsent')    │      tới tất cả trong room
      │ <─────────────────────────│─────────────> Client B
```

### 7.4 Xoá vs Thu hồi — Sự khác biệt

| | **Delete** (Xoá phía mình) | **Unsend** (Thu hồi) |
|---|---|---|
| **Ai thấy?** | Chỉ ẩn với sender | Ẩn với tất cả |
| **Thời hạn** | Không giới hạn | 24 giờ kể từ lúc gửi |
| **Cơ chế DB** | `deletedAt` ≠ null | `isUnsent = true`, `content = ''` |
| **Phục hồi?** | Có thể (nếu code hỗ trợ) | Không thể |
| **Receiver thấy gì?** | Vẫn thấy tin nhắn bình thường | Thấy "Tin nhắn đã thu hồi" |

### 7.5 Typing Indicator

```
 Client A                   Server                    Client B
      │                        │                          │
      │ emit('typing', {       │                          │
      │   conversationId,      │                          │
      │   isTyping: true       │                          │
      │ })                     │                          │
      │ ──────────────────────>│                          │
      │                        │  broadcast.to(room)      │
      │                        │  emit('typingStatus', {  │
      │                        │    conversationId,       │
      │                        │    userId: A,            │
      │                        │    isTyping: true        │
      │                        │  })                      │
      │                        │ ─────────────────────────>
      │                        │                          │
      │ (Sau 3 giây)           │                          │
      │ emit('typing', {       │                          │
      │   isTyping: false      │                          │
      │ })                     │                          │
      │ ──────────────────────>│                          │
      │                        │ emit('typingStatus',     │
      │                        │  isTyping: false)        │
      │                        │ ─────────────────────────>
```

> **Khuyến nghị Frontend**: Implement debounce 300ms cho `isTyping: true` và auto-send `isTyping: false` sau 3 giây không nhập gì.

### 7.6 Presence (Online/Offline)

```
 Client A                   Server                    All Clients
      │                        │                          │
      │ ── connect() ─────────>│                          │
      │                        │ WsJwtGuard: verify JWT   │
      │                        │ PresenceService.setOnline()
      │                        │                          │
      │                        │ emit('userStatus', {     │
      │                        │   userId: A,             │
      │                        │   isOnline: true         │
      │                        │ })                       │
      │                        │ ─────────────────────────>
      │                        │                          │
      │ ── disconnect() ──────>│                          │
      │                        │ PresenceService.setOffline()
      │                        │ emit('userStatus', {     │
      │                        │   userId: A,             │
      │                        │   isOnline: false,       │
      │                        │   lastSeenAt: Date       │
      │                        │ })                       │
      │                        │ ─────────────────────────>
```

---

## 8. Hướng dẫn tích hợp Frontend

### 8.1 Setup kết nối

```javascript
// chat.socket.js
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5002';

export function createChatSocket(accessToken) {
  const socket = io(API_URL, {
    auth: { token: accessToken },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Chat connected:', socket.id);
  });

  socket.on('error', ({ code, message }) => {
    console.error(`Chat error [${code}]:`, message);
  });

  socket.on('connect_error', (err) => {
    console.error('Connection failed:', err.message);
    // Token hết hạn → refresh token → reconnect
  });

  return socket;
}
```

### 8.2 Tham gia hội thoại

```javascript
function joinConversation(socket, conversationId) {
  socket.emit('joinConversation', { conversationId });

  socket.on('joinedConversation', ({ conversationId }) => {
    console.log('Joined:', conversationId);
  });
}
```

### 8.3 Gửi tin nhắn

```javascript
function sendMessage(socket, { conversationId, receiverId, content, type = 'text' }) {
  socket.emit('sendMessage', {
    conversation: conversationId,
    receiver: receiverId,
    content: content,
    messageType: type,
    // sender: KHÔNG CẦN — server tự lấy từ JWT
  });
}

// Lắng nghe tin nhắn mới
socket.on('newMessage', (message) => {
  // message = full MessageModel object
  addMessageToUI(message);
});
```

### 8.4 Đánh dấu đã đọc

```javascript
function markAsRead(socket, conversationId, messageId) {
  socket.emit('readMessage', { conversationId, messageId });
}

// Lắng nghe tin nhắn bị đọc
socket.on('messageRead', ({ messageId, readerId }) => {
  updateMessageStatusUI(messageId, 'read');
});
```

### 8.5 Typing Indicator

```javascript
let typingTimeout;

function handleInputChange(socket, conversationId) {
  socket.emit('typing', { conversationId, isTyping: true });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { conversationId, isTyping: false });
  }, 3000); // Auto-stop sau 3 giây
}

socket.on('typingStatus', ({ conversationId, userId, isTyping }) => {
  if (isTyping) {
    showTypingIndicator(conversationId, userId);
  } else {
    hideTypingIndicator(conversationId, userId);
  }
});
```

### 8.6 Thu hồi tin nhắn

```javascript
function unsendMessage(socket, messageId, conversationId) {
  socket.emit('unsendMessage', { messageId, conversationId });
}

socket.on('messageUnsent', ({ messageId, unsentBy }) => {
  replaceMessageContent(messageId, 'Tin nhắn đã thu hồi');
});
```

### 8.7 Trạng thái Online/Offline

```javascript
socket.on('userStatus', ({ userId, isOnline, lastSeenAt }) => {
  if (isOnline) {
    showOnlineBadge(userId);
  } else {
    showLastSeen(userId, lastSeenAt);
  }
});
```

---

## 9. Mở rộng & Nâng cấp

### 9.1 PresenceService — Kiến trúc Redis

`PresenceService` sử dụng **Redis** (qua `@nestjs/cache-manager` + `@keyv/redis`) — cùng pattern với `SessionUtil`. Đây là thiết kế phù hợp cho cả single-instance lẫn multi-instance.

#### Cơ chế hoạt động

```
┌──────────────┐     setOnline()      ┌──────────┐
│   Gateway    │ ────────────────────> │  Redis   │
│ (connect)    │                      │          │
│              │     isOnline()       │ Key:     │
│ (sendMsg)    │ ────────────────────> │ presence │
│              │                      │ :{uuid}  │
│ (disconnect) │     setOffline()     │          │
│              │ ────────────────────> │ TTL:30m  │
└──────────────┘                      └──────────┘
```

#### Key Pattern & TTL

| Thuộc tính | Giá trị |
|------------|---------|
| **Key pattern** | `presence:{userId}` |
| **Value** | `{ socketId, connectedAt }` |
| **TTL** | 30 phút (auto-expire nếu không renew) |
| **Provider token** | `PresenceCacheProvider` |

#### Tại sao dùng Redis ngay cả khi chạy 1 instance?

| Tiêu chí | In-memory Map | Redis ✅ |
|----------|---------------|----------|
| **Server restart** | ❌ Mất hết data | ✅ Data vẫn còn |
| **Chia sẻ state** | ❌ Chỉ Gateway đọc được | ✅ Mọi service/module đều query được |
| **TTL tự động** | ❌ Phải tự code cleanup | ✅ `EXPIRE` tự động, phát hiện zombie |
| **Multi-instance** | ❌ Cần rewrite | ✅ Ready to scale |

#### Heartbeat Renewal

Khi user vẫn đang active (gửi tin, typing...), Gateway gọi `renewPresence()` để gia hạn TTL:

```typescript
// Gọi trong handleSendMessage hoặc handleTyping:
await this.presenceService.renewPresence(userId);
```

Nếu user mất mạng đột ngột (không disconnect gracefully), Redis sẽ **tự động expire** key sau 30 phút → user tự động offline.

### 9.2 Group Chat

Mở rộng `Conversation` để hỗ trợ nhóm:

```prisma
model Conversation {
  // ... existing fields
  type        String    @default("direct")  // "direct" | "group"
  name        String?                        // Tên nhóm (chỉ group)
  adminIds    String[]  @db.ObjectId         // Admin của nhóm
  avatarUrl   String?
}
```

### 9.3 Push Notification

Khi receiver **offline**, thay vì chỉ lưu status = `sent`, có thể tích hợp:

```typescript
// Trong handleSendMessage, sau khi save:
if (!(await this.presenceService.isOnline(payload.receiver))) {
  await this.notificationService.sendPushNotification(
    payload.receiver,
    { title: senderName, body: content }
  );
}
```

### 9.4 Message Reactions

Thêm emoji reaction (like, love, haha, wow, sad, angry):

```prisma
model MessageReaction {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  emoji     String   // "👍", "❤️", "😂"
  userId    String   @db.ObjectId
  messageId String   @db.ObjectId
  message   Message  @relation(fields: [messageId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, messageId, emoji])
  @@map("message_reactions")
}
```

### 9.5 Rate Limiting (Khuyến nghị cho Production)

```typescript
// Giới hạn số message/phút mỗi user
const MESSAGE_RATE_LIMIT = 60;     // 60 tin nhắn/phút
const TYPING_RATE_LIMIT = 5;       // 5 events/giây

// Implement bằng sliding window counter (Redis)
```

---

## Phụ lục

### A. Checklist triển khai

Khi deploy hoặc sau khi merge code:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Sync schema với MongoDB
npx prisma db push

# 3. Build kiểm tra TypeScript
npm run build
```

### B. Environment Variables

```env
DATABASE_URL=mongodb://...                          # MongoDB connection string
CACHE_REDIS_URL=redis://localhost:6379              # Redis cho cache & presence
QUEUE_REDIS_URL=redis://localhost:6379              # Redis cho queue (BullMQ)
# WebSocket Gateway chạy trên port 5002 (hardcoded trong chat.gateway.ts)
```

### C. Testing với Socket.IO Client (CLI)

```bash
# Cài đặt wscat hoặc dùng Postman WebSocket
npm install -g socket.io-client-cli

# Hoặc test nhanh bằng Node.js REPL:
node -e "
  const io = require('socket.io-client');
  const s = io('http://localhost:5002', { auth: { token: 'YOUR_JWT' } });
  s.on('connect', () => console.log('Connected!'));
  s.on('error', (e) => console.log('Error:', e));
"
```

