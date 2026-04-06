import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageService } from './services/message.service';
import { JoinConversationDto } from './dtos/request/join-conversation.dto';
import { SendMessageDto } from './dtos/request/send-message.dto';
import { EnumMessageGwEvents } from './enums/message.gateway-events.enum';
import { EnumChatStatusCodeError } from './enums/message-status-code.enum';
import { ReadMessageDto } from './dtos/request/read-message.dto';
import { ConversationService } from './services/conversation.service';
import { PresenceService } from './services/presence.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { MessageModel } from './models/message.model';

@WebSocketGateway(5002, {
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly presenceService: PresenceService
  ) {}

  // ======================== Connection Lifecycle ========================

  async handleConnection(client: Socket) {
    const userId = client.data?.userId;
    if (!userId) {
      client.disconnect();
      return;
    }

    await this.presenceService.setOnline(userId, client.id);
    this.server.emit(EnumMessageGwEvents.userStatus, {
      userId,
      isOnline: true,
    });
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      await this.presenceService.setOffline(userId);
      this.server.emit(EnumMessageGwEvents.userStatus, {
        userId,
        isOnline: false,
        lastSeenAt: new Date(),
      });
    }
  }

  // ======================== Conversation Room ========================

  @SubscribeMessage(EnumMessageGwEvents.joinConversation)
  async handleJoinConversation(
    @MessageBody() payload: JoinConversationDto,
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data?.userId;
    const conversation = await this.conversationService.findOne(
      payload.conversationId
    );

    if (!conversation) {
      this.emitError(
        client,
        EnumChatStatusCodeError.invalidConversation,
        'conversation.error.invalidConversation'
      );
      return;
    }

    // Verify user is a participant
    if (!conversation.participantIds.includes(userId)) {
      this.emitError(
        client,
        EnumChatStatusCodeError.invalidConversation,
        'conversation.error.notParticipant'
      );
      return;
    }

    client.join(payload.conversationId);
    client.emit(EnumMessageGwEvents.joinedConversation, {
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage(EnumMessageGwEvents.leaveConversation)
  handleLeaveConversation(
    @MessageBody() payload: JoinConversationDto,
    @ConnectedSocket() client: Socket
  ) {
    client.leave(payload.conversationId);
  }

  // ======================== Messaging ========================

  @SubscribeMessage(EnumMessageGwEvents.sendMessage)
  async handleSendMessage(
    @MessageBody() payload: SendMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data?.userId;

    // Enforce sender identity from JWT, not from payload
    payload.sender = userId;

    const conversation = await this.conversationService.findOne(
      payload.conversation
    );

    if (!conversation) {
      this.emitError(
        client,
        EnumChatStatusCodeError.invalidConversation,
        'conversation.error.invalidConversation'
      );
      return;
    }

    // Verify sender is participant
    if (!conversation.participantIds.includes(userId)) {
      this.emitError(
        client,
        EnumChatStatusCodeError.invalidConversation,
        'conversation.error.notParticipant'
      );
      return;
    }

    const savedMessage: MessageModel = await this.messageService.sendMessage(
      conversation,
      payload
    );

    // Broadcast to conversation room
    this.server
      .to(payload.conversation)
      .emit(EnumMessageGwEvents.newMessage, savedMessage);

    // Auto-deliver if receiver is online
    if (await this.presenceService.isOnline(payload.receiver)) {
      const delivered = await this.messageService.markMessageDelivered(
        savedMessage.id
      );
      this.server
        .to(payload.conversation)
        .emit(EnumMessageGwEvents.messageDelivered, {
          messageId: delivered.id,
          conversationId: payload.conversation,
        });
    }

    return savedMessage;
  }

  // ======================== Read Receipts ========================

  @SubscribeMessage(EnumMessageGwEvents.readMessage)
  async handleReadMessage(
    @MessageBody() payload: ReadMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const readerId = client.data?.userId;
    if (!readerId) {
      this.emitError(
        client,
        EnumChatStatusCodeError.missingUserId,
        'User ID missing'
      );
      return;
    }

    const message = await this.messageService.findOneById(payload.messageId);
    if (!message) {
      this.emitError(
        client,
        EnumChatStatusCodeError.messageNotFound,
        'Message not found'
      );
      return;
    }

    const updated = await this.messageService.markMessageRead(
      message,
      readerId
    );

    this.server
      .to(payload.conversationId)
      .emit(EnumMessageGwEvents.messageRead, {
        messageId: payload.messageId,
        conversationId: payload.conversationId,
        readerId,
      });

    return updated;
  }

  // ======================== Typing Indicator ========================

  @SubscribeMessage(EnumMessageGwEvents.typing)
  handleTyping(
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data?.userId;
    client.broadcast
      .to(payload.conversationId)
      .emit(EnumMessageGwEvents.typingStatus, {
        conversationId: payload.conversationId,
        userId,
        isTyping: payload.isTyping,
      });
  }

  // ======================== Delete & Unsend ========================

  @SubscribeMessage(EnumMessageGwEvents.deleteMessage)
  async handleDeleteMessage(
    @MessageBody() payload: { messageId: string; conversationId: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data?.userId;

    try {
      await this.messageService.softDeleteMessage(payload.messageId, userId);

      client.emit(EnumMessageGwEvents.messageDeleted, {
        messageId: payload.messageId,
        conversationId: payload.conversationId,
        deletedBy: userId,
        scope: 'sender',
      });
    } catch (err: any) {
      this.emitError(
        client,
        EnumChatStatusCodeError.messageNotFound,
        err.message || 'message.error.deleteFailed'
      );
    }
  }

  @SubscribeMessage(EnumMessageGwEvents.unsendMessage)
  async handleUnsendMessage(
    @MessageBody() payload: { messageId: string; conversationId: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data?.userId;

    try {
      await this.messageService.unsendMessage(payload.messageId, userId);

      this.server
        .to(payload.conversationId)
        .emit(EnumMessageGwEvents.messageUnsent, {
          messageId: payload.messageId,
          conversationId: payload.conversationId,
          unsentBy: userId,
        });
    } catch (err: any) {
      this.emitError(
        client,
        EnumChatStatusCodeError.messageNotFound,
        err.message || 'message.error.unsendFailed'
      );
    }
  }

  // ======================== Private Helpers ========================

  private emitError(
    client: Socket,
    code: string | number,
    message: string
  ): void {
    client.emit(EnumMessageGwEvents.error, { code, message });
  }
}
