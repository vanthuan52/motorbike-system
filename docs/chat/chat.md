# Overview

Tài liệu này cung cấp hướng dẫn chi tiết về cách triển khai tính năng chat 1-1, đảm bảo các tiêu chí Code Cleanliness, Scalability, Maintainability, và Readability

# Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [1-1 Conversations](#1-1-conversations)
  - [Overview](#overview-1)
  - [Architecture](#architecture)
  - [Business Logic and UX](#business-logic-and-ux)
  - [Security](#security)
  - [Performance and Scalability](#performance-and-scalability)
  - [Related Components](#related-components)
  - [Implementation](#implementation)
    - [Schemas](#schemas)
    - [API RESTful](#api-restful)
    - [WebSocket Gateway](#websocket-gateway)

# 1-1 Conversations

## Overview

Tính năng chat 1-1 cho phép hai người dùng trong hệ thống trao đổi tin nhắn trực tiếp theo thời gian thực. Lịch sử chat sẽ được lưu trữ và có thể truy cập được sau này.

## Architecture

**Giao thức Real-time:**

- Websocket: Cung cấp kết nối song công liên tục giữa client và server, cho phép gửi và nhận tin nhắn tức thì
- Fallback (optional): Một số thư viện Websocket (socket.io) có cơ chế fallback sang Long Polling hoặc Server-Sent events (SSE) nếu Websocket không khả dụng, giúp tăng tương thích

**Backend:**

- NestJS với Websocket Gateway: Quản lý các kết nối Websocket và xử lý logic chat
- Khả năng mở rộng: Khi số lượng người dùng chat tăng, cần xem xét việc sử dụng Redis Adapter cho Socket.IO (trong NestJS). Redis Adapter cho phép mở rộng NestJS WebSocket Gateway trên nhiều instance, đảm bảo người dùng có thể chat với nhau ngay cả khi họ kết nối đến các server khác nhau.

**Lưu trữ tin nhắn**

- Cơ sở dữ liệu: MongoDB, MySQL, ...
- Schema: Cần thiết kế cấu trúc bảng/collection để lưu trữ tin nhắn (ID tin nhắn, nội dung, người gửi, người nhận, thời gian gửi, trạng thái đọc/chưa đọc, loại tin nhắn: văn bản, hình ảnh, file...).

**Thông báo đẩy (Cho thiết bị di động)**

- FCM (Android) / APNS (iOS): Bắt buộc để thông báo cho người dùng khi họ offline hoặc ứng dụng ở chế độ nền. Backend của bạn sẽ gửi yêu cầu đến các dịch vụ này.
- Device Token: Cần một cơ chế để lưu trữ device token của người dùng (được lấy từ Flutter) trên backend để gửi thông báo đẩy.

**Xử lý offline/Lỡ tin nhắn**

- Lưu trữ và Truy xuất: Khi người dùng offline, tin nhắn sẽ được lưu vào DB. Khi họ online trở lại, ứng dụng cần fetch lịch sử chat và các tin nhắn chưa đọc.
- Hiển thị Badge/Số lượng chưa đọc: Cập nhật số lượng tin nhắn chưa đọc trên icon ứng dụng hoặc trên các mục chat trong UI.

## Business Logic and UX

1. Quản lý phiên chat (Conversations/Rooms): Làm thế nào để xác định một cuộc trò chuyện 1-1 duy nhất giữa hai người dùng (ví dụ: dùng một ID cuộc trò chuyện duy nhất dựa trên cặp User IDs).

2. Trạng thái tin nhắn:

- Gửi (Sent): Tin nhắn đã được gửi từ client.
- Đã nhận (Delivered): Tin nhắn đã đến server.
- Tin nhắn đã được người nhận đọc. (Cần cơ chế client gửi xác nhận "đã đọc" về server).

3. Trạng thái Online/Offline: Hiển thị trạng thái online/offline của người đang chat cùng.

4. Đang gõ... (Typing Indicator): Hiển thị khi người kia đang gõ tin nhắn.

5. Phân trang (Pagination) lịch sử Chat: Khi load lịch sử chat, chỉ load một số lượng nhất định tin nhắn cũ và cho phép người dùng cuộn lên để xem thêm (infinite scrolling).

6. Xử lý tin nhắn đa phương tiện: Hỗ trợ gửi hình ảnh, video, file (cần lưu trữ trên các dịch vụ lưu trữ đám mây như S3, Google Cloud Storage và gửi URL).

7. Thông báo trong ứng dụng (In-app Notifications): Khi người dùng đang mở ứng dụng nhưng không ở trong cuộc trò chuyện đó, hiển thị thông báo nhẹ nhàng (SnackBar, Toast) thay vì thông báo đẩy hệ thống. (Optional)

## Security

1. Xác thực (Authentication): Đảm bảo chỉ những người dùng đã đăng nhập mới có thể chat. WebSocket connections cũng cần được xác thực.

2. Ủy quyền (Authorization): Đảm bảo người dùng A chỉ có thể chat với người dùng B và truy cập tin nhắn của họ, không phải của người khác.

3. Mã hóa (Encryption):

- SSL/TLS: Sử dụng wss:// (WebSocket Secure) để mã hóa giao tiếp giữa client và server.
- Mã hóa đầu cuối (End-to-End Encryption - E2EE): Nếu cần mức độ bảo mật cao như WhatsApp, cần triển khai E2EE (rất phức tạp, thường không cần thiết cho ứng dụng thông thường).

## Performance and Scalability

1. Load balancing: Khi có nhiều NestJS server, cần một Load Balancer phía trước để phân phối các kết nối đến các instance server (Later)
2. Giới hạn số lượng kết nối/tin nhắn: Đặt ra các giới hạn để ngăn chặn và lạm dụng hoặc tấn công DDoS
3. Tối ưu hóa Database Queries: Đảm bảo các truy vấn lấy/lưu tin nhắn, cập nhật trạng thái đọc nhanh chóng và hiệu quả

## Related Components

1. Client-side

**Flutter App**

- Chat Screen: Giao diện người để hiển thị tin nhắn, khung nhập tin nhắn
- Chat List Screen: Hiển thị danh sách các cuộc trò chuyện (conversations) mà người dùng tham gia
- WebSocket Service/Provider: Quản lý kết nối Websocket đến backend, gửi/nhận tin nhắn
- Notification Handler: Xử lý thông báo đẩy từ FCM/APNS (hiển thị khi offline, xử lý khi foreground)
- Local Data Storage: Lưu trữ tạm thời tin nhắn hoặc dữ liệu chat để cải thiện người dùng (ví dụ: hiển thị ngay cả khi mạng yếu).

**Web App**

- Giao diện Chat: Hiển thị tin nhắn, nhập liệu.
- Giao diện Danh sách Chat: Liệt kê các cuộc hội thoại.
- Quản lý trạng thái UI: Sử dụng các thư viện quản lý trạng thái của React/Next.js (Redux, Zustand, React Context) để quản lý trạng thái chat (lịch sử tin nhắn, trạng thái gõ, v.v.). Điều này giúp dễ dàng tái sử dụng logic ở các thành phần UI khác.
- WebSocket Client Logic: Quản lý kết nối và nhận/gửi sự kiện.
- HTTP Client Logic: Gọi API REST để lấy lịch sử chat, gửi các yêu cầu không real-time.

2. Server-side

- User Module: Quản lý thông tin người dùng, xác thực
- Chat Module:

  - Chat Gateway (@WebSocketGateway): Điểm vào cho các kết nối Websocket, xử lý các sự kiện real-time (gửi tin nhắn, typing, online/offline).
  - Chat Service: Chứa logic nghiệp vụ chat cốt lỗi (lưu tin nhắn vào DB, lấy lịch sử chat, cập nhật trạng thái)
  - Chat controller (API REST): Cung cấp các API để lấy lịch sử chat ban đầu (khi load ứng dụng), hoặc các hoạt động không cần real-time ngay lập tức
  - Chat Entity/Model: Định nghĩa cấu trúc của tin nhắn, cuộc trò chuyện trong cơ sở dữ liệu.

- Notification Module (Later)

  - Notification Service: Chứa logic để gửi thông báo đẩy đến FCM/APNS.
  - Device Token Repository: Lưu trữ device token của người dùng.

- Database (e.g., PostgreSQL/MongoDB):
  - Users Table/Collection: Lưu trữ thông tin người dùng.
  - Messages Table/Collection: Lưu trữ các tin nhắn (id, sender_id, receiver_id, conversation_id, content, timestamp, status).
  - Conversations Table/Collection: Lưu trữ thông tin về các cuộc trò chuyện (id, participant_ids, last_message_id, unread_count).
  - UserDeviceTokens Table/Collection: Lưu trữ device tokens cho mỗi người dùng.

3. Các thành phần hạ tầng

- Load Balancer: Để phân phối lưu lượng đến các NestJS instances (nếu scale).
- Redis Server:

  - Redis Adapter for Socket.IO: Để đồng bộ các sự kiện WebSocket giữa nhiều NestJS instances.
  - Pub/Sub (tùy chọn): Để giao tiếp nội bộ giữa các service/module trong backend nếu cần.
  - Cache: Để lưu trữ nhanh các dữ liệu chat thường xuyên truy cập (ví dụ: trạng thái online của người dùng).

- Firebase Project: Cấu hình và tích hợp với FCM để gửi thông báo đẩy.
- Cloud Storage (S3/GCS - nếu hỗ trợ ảnh/file): Để lưu trữ các file đa phương tiện (ảnh, video) được gửi qua chat.

## Implementation

### Schemas

**Users**

**Conversations**

- id (pk)
- participants: Array<UUID> hoặc Array<ObjectId>
- lastMessageId: UUID (ID tin nhắn cuối cùng trong cuộc trò chuyện)
- createdAt, updatedAt

**Messages**

- id (pk)
- conversationId:: UUID/ObjectID
- senderId: UUID/ObjectId
- receiverId: UUID/ObjectId
- content: string (nội dung tin nhắn)
- messageType: enum(text, image, file)
- timestamp: Date (Thời gian gửi tin nhắn)
- status: enum(sent, delivered, read)
- readBy: Array<UUID> (IDs của những người đã đọc tin nhắn - có thể dùng cho nhóm, hoặc chỉ 1 cho 1-1)

**UserDeviceTokens (Later)**

- userId: UUID/ObjectId
- deviceToken: string (Token từ FCM/APNS)
- platform: enum(android, ios)

### API RESTful

**GET /conversations: Lấy danh sách các cuộc trò chuyện của người dùng hiện tại**

- Input: Token xác thực người dùng.
- Output: [{ id, participantIds, lastMessage, unreadCount, ... }]

**GET /conversations/:id/messages: Lấy lịch sử tin nhắn của một cuộc trò chuyện**

- Input: conversationId, cursor (để phân trang), limit
- Output: [{ id, senderId, content, timestamp, status, ... }]

**POST /conversations: Tạo một cuộc trò chuyện mới (nếu chưa có)**

- Input: participantIds
- Output: conversationId

**PUT /messages/:id/read: Đánh dấu một tin nhắn là đã đọc.**

- Input: messageId
- Output: Trạng thái thành công.

### Websocket Gateway

**Sự kiện gửi từ Client (Next.js/Flutter)**

- 'sendMessage': Gửi một tin nhắn mới.

  - Payload: { conversationId, receiverId, content, messageType (text, image, etc.), tempId (optional for optimistic updates) }
  - Xử lý: Lưu vào DB, đẩy đến người nhận qua WebSocket (nếu online), xác nhận lại client.

- 'joinConversation': Người dùng tham gia (hoặc tái kết nối) vào một cuộc trò chuyện cụ thể.

  - Payload: { conversationId }
  - Xử lý: Gán socket vào room tương ứng

- 'typing': Người dùng đang gõ tin nhắn.

  - Payload: { conversationId, isTyping }
  - Xử lý: Đẩy sự kiện 'typingStatus' tới người còn lại trong cuộc trò chuyện.

- 'readMessage': Client gửi xác nhận tin nhắn đã được đọc.
  - Payload: { messageId, conversationId }
  - Xử lý: Cập nhật trạng thái tin nhắn trong DB, đẩy sự kiện 'messageRead' tới người gửi.

**Sự kiện đẩy tới Client:**

- 'newMessage': Tin nhắn mới.

  - Payload: { id, senderId, receiverId, conversationId, content, timestamp, ... }

- 'typingStatus': Trạng thái đang gõ

  - Payload: { conversationId, userId, isTyping }

- 'messageRead': Tin nhắn đã được đọc.

  - Payload: { messageId, conversationId, readerId }

- 'userStatus': Trạng thái online/offline của người dùng
  - Payload: { userId, isOnline }

### Edge cases

**Error Handling**

- Mỗi API và sự kiện WebSocket nên xử lý lỗi rõ ràng:

* API: Trả về 4xx cho lỗi phía client, 5xx cho lỗi phía server.
* WebSocket: Gửi sự kiện error với thông tin lỗi chi tiết

```json
    {

        "event": "error",
        "payload": {
        "code": "INVALID_CONVERSATION",
        "message": "Cuộc trò chuyện không tồn tại hoặc bạn không có quyền truy cập."
    }
  }
  `
```

**Rate Limiting & Spam Prevention**

**Retention Policy & Message Deletion**

- Có cần giới hạn thời gian lưu trữ tin nhắn không?
- Hỗ trợ xóa tin nhắn (delete for me / delete for everyone)?

**Reactions & Emoji**

**Multi-device Sync**

**Delivery Retry Mechanism**
