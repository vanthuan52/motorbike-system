import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './services/chat.service';
import { JoinConversationDto } from './dtos/request/join-conversation.dto';
import { SendMessageDto } from './dtos/request/send-message.dto';
import { MessageEntity } from './entities/message.entity';
import { ENUM_CHAT_GW_EVENTS } from './enums/chat.gateway-events.enum';
import { emitSocketError } from './utils/socket-error.util';
import { ENUM_CHAT_STATUS_CODE_ERROR } from './enums/chat-status-code.enum';
import { ReadMessageDto } from './dtos/request/read-message.dto';

@WebSocketGateway(5002, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit(ENUM_CHAT_GW_EVENTS.USER_STATUS, {
        userId,
        isOnline: true,
      });
      client.data.userId = userId;
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit(ENUM_CHAT_GW_EVENTS.USER_STATUS, {
        userId,
        isOnline: false,
      });
    }
  }

  @SubscribeMessage(ENUM_CHAT_GW_EVENTS.JOIN_CONVERSATION)
  handleJoinConversation(
    @MessageBody() payload: JoinConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.conversationId);
    client.emit(ENUM_CHAT_GW_EVENTS.JOINED_CONVERSATION, {
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage(ENUM_CHAT_GW_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() payload: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const conversation = await this.chatService.findOneConversation(
      payload.conversation,
    );

    if (!conversation) {
      emitSocketError(
        client,
        ENUM_CHAT_STATUS_CODE_ERROR.INVALID_CONVERSATION,
        'conversation.error.invalidConversation',
      );
      return;
    }

    const savedMessage: MessageEntity = await this.chatService.sendMessage(
      conversation,
      payload,
    );

    client.broadcast
      .to(payload.conversation)
      .emit(ENUM_CHAT_GW_EVENTS.NEW_MESSAGE, savedMessage);

    client.emit(ENUM_CHAT_GW_EVENTS.NEW_MESSAGE, savedMessage);

    return savedMessage;
  }

  @SubscribeMessage(ENUM_CHAT_GW_EVENTS.READ_MESSAGE)
  async handleReadMessage(
    @MessageBody() payload: ReadMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.findAllMessages(
      payload.conversationId,
    );

    const targetMsg = messages?.find(
      (m) => m._id.toString() === payload.messageId,
    );
    if (!targetMsg) {
      client.emit(ENUM_CHAT_GW_EVENTS.ERROR, { message: 'Message not found' });
      return;
    }

    const readerId = client.data?.userId;
    if (!readerId) {
      client.emit(ENUM_CHAT_GW_EVENTS.ERROR, { message: 'User ID missing' });
      return;
    }

    const updated = await this.chatService.markMessageRead(targetMsg, readerId);

    this.server
      .to(payload.conversationId)
      .emit(ENUM_CHAT_GW_EVENTS.MESSAGE_READ, {
        messageId: payload.messageId,
        conversationId: payload.conversationId,
        readerId,
      });

    return updated;
  }
  @SubscribeMessage(ENUM_CHAT_GW_EVENTS.TYPING)
  handleTyping(
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.userId;
    this.server
      .to(payload.conversationId)
      .emit(ENUM_CHAT_GW_EVENTS.TYPING_STATUS, {
        conversationId: payload.conversationId,
        userId,
        isTyping: payload.isTyping,
      });
  }
}
