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
import { MessageService } from './services/message.service';
import { JoinConversationDto } from './dtos/request/join-conversation.dto';
import { SendMessageDto } from './dtos/request/send-message.dto';
import { EnumMessageGwEvents } from './enums/message.gateway-events.enum';
import { emitSocketError } from './utils/socket-error.util';
import { EnumChatStatusCodeError } from './enums/message-status-code.enum';
import { ReadMessageDto } from './dtos/request/read-message.dto';
import { ConversationService } from './services/conversation.service';
import { MessageModel } from './models/message.model';

@WebSocketGateway(5002, {
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>();

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit(EnumMessageGwEvents.userStatus, {
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
      this.server.emit(EnumMessageGwEvents.userStatus, {
        userId,
        isOnline: false,
      });
    }
  }

  @SubscribeMessage(EnumMessageGwEvents.joinConversation)
  handleJoinConversation(
    @MessageBody() payload: JoinConversationDto,
    @ConnectedSocket() client: Socket
  ) {
    client.join(payload.conversationId);
    client.emit(EnumMessageGwEvents.joinedConversation, {
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage(EnumMessageGwEvents.sendMessage)
  async handleSendMessage(
    @MessageBody() payload: SendMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const conversation = await this.conversationService.findOne(
      payload.conversation
    );

    if (!conversation) {
      emitSocketError(
        client,
        EnumChatStatusCodeError.invalidConversation,
        'conversation.error.invalidConversation'
      );
      return;
    }

    const savedMessage: MessageModel = await this.messageService.sendMessage(
      conversation,
      payload
    );

    client.broadcast
      .to(payload.conversation)
      .emit(EnumMessageGwEvents.newMessage, savedMessage);

    client.emit(EnumMessageGwEvents.newMessage, savedMessage);

    return savedMessage;
  }

  @SubscribeMessage(EnumMessageGwEvents.readMessage)
  async handleReadMessage(
    @MessageBody() payload: ReadMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const messages = await this.messageService.findAllMessages(
      payload.conversationId
    );

    const targetMsg = messages?.find(m => m.id === payload.messageId);
    if (!targetMsg) {
      client.emit(EnumMessageGwEvents.error, {
        message: 'Message not found',
      });
      return;
    }

    const readerId = client.data?.userId;
    if (!readerId) {
      client.emit(EnumMessageGwEvents.error, { message: 'User ID missing' });
      return;
    }

    const updated = await this.messageService.markMessageRead(
      targetMsg,
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
  @SubscribeMessage(EnumMessageGwEvents.typing)
  handleTyping(
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data?.userId;
    this.server
      .to(payload.conversationId)
      .emit(EnumMessageGwEvents.typingStatus, {
        conversationId: payload.conversationId,
        userId,
        isTyping: payload.isTyping,
      });
  }
}
