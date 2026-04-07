import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SendMessageDto } from '../dtos/request/send-message.dto';
import { EnumMessageStatus } from '../enums/message.enum';
import { MessageRepository } from '../repository/message.repository';
import { IMessageService } from '../interfaces/message.service.interface';
import { MessageModel } from '../models/message.model';
import { ConversationModel } from '../models/conversation.model';
import { ConversationService } from './conversation.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumChatStatusCodeError } from '../enums/message-status-code.enum';
import { Prisma } from '@/generated/prisma-client';

// Maximum time (in hours) allowed to unsend a message
const UNSEND_TIME_LIMIT_HOURS = 24;

import { IMessageListFilters } from '../interfaces/message.filter.interface';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationService: ConversationService
  ) {}

  // ======================== Core Messaging ========================

  async sendMessage(
    conversation: ConversationModel,
    payload: SendMessageDto
  ): Promise<MessageModel> {
    const { content, messageType, receiver, sender } = payload;
    const attachments = (payload as any).attachments;
    const savedMessage = await this.messageRepository.create({
      conversation: { connect: { id: conversation.id } },
      content,
      messageType,
      receiver: { connect: { id: receiver } },
      sender: { connect: { id: sender } },
      status: EnumMessageStatus.sent,
      readBy: [sender],
      attachments: attachments ? (attachments as any) : undefined,
      createdBy: sender,
    });

    // Update conversation's last message pointer
    await this.conversationService.updateLastMessage(
      conversation.id,
      savedMessage.id
    );

    return savedMessage;
  }

  async findAllMessages(conversationId: string): Promise<MessageModel[]> {
    return this.messageRepository.findMany({
      conversationId,
      deletedAt: null,
    });
  }

  // ======================== Message Status ========================

  async markMessageDelivered(messageId: string): Promise<MessageModel> {
    const message = await this.findOneByIdOrFail(messageId);

    if (message.status === EnumMessageStatus.read) {
      return message; // Already read, no need to downgrade
    }

    return this.messageRepository.update(messageId, {
      status: EnumMessageStatus.delivered,
    });
  }

  async markMessageRead(
    message: MessageModel,
    readerId: string
  ): Promise<MessageModel> {
    const readBy = message.readBy || [];
    if (!readBy.includes(readerId)) {
      readBy.push(readerId);
    }

    return this.messageRepository.update(message.id, {
      readBy,
      status: EnumMessageStatus.read,
    });
  }

  // ======================== Delete & Unsend ========================

  /**
   * Soft delete a message for the sender only.
   * The message remains visible to the receiver.
   */
  async softDeleteMessage(
    messageId: string,
    userId: string
  ): Promise<MessageModel> {
    const message = await this.findOneByIdOrFail(messageId);

    if (message.senderId !== userId) {
      throw new ForbiddenException({
        statusCode: EnumChatStatusCodeError.messageNotFound,
        message: 'message.error.notAuthorized',
      });
    }

    return this.messageRepository.update(messageId, {
      deletedAt: new Date(),
      deletedBy: userId,
    });
  }

  /**
   * Unsend (recall) a message for all participants.
   * Only the sender can unsend, and only within the time limit.
   */
  async unsendMessage(
    messageId: string,
    senderId: string
  ): Promise<MessageModel> {
    const message = await this.findOneByIdOrFail(messageId);

    if (message.senderId !== senderId) {
      throw new ForbiddenException({
        statusCode: EnumChatStatusCodeError.messageNotFound,
        message: 'message.error.notAuthorized',
      });
    }

    // Check time limit
    const timeDiffMs = Date.now() - new Date(message.timestamp).getTime();
    const timeLimitMs = UNSEND_TIME_LIMIT_HOURS * 60 * 60 * 1000;

    if (timeDiffMs > timeLimitMs) {
      throw new BadRequestException({
        statusCode: EnumChatStatusCodeError.messageNotFound,
        message: 'message.error.unsendTimeLimitExceeded',
      });
    }

    return this.messageRepository.update(messageId, {
      isUnsent: true,
      content: '',
      attachments: null as any,
      updatedBy: senderId,
    });
  }

  // ======================== Pagination ========================

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: IMessageListFilters
  ): Promise<IPaginationOffsetReturn<MessageModel>> {
    const { data, ...others } =
      await this.messageRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
          deletedAt: null,
        },
      });

    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: IMessageListFilters
  ): Promise<IPaginationCursorReturn<MessageModel>> {
    const { data, ...others } =
      await this.messageRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
          deletedAt: null,
        },
      });

    return { data, ...others };
  }

  // ======================== Lookup ========================

  async findOneById(id: string): Promise<MessageModel | null> {
    return this.messageRepository.findOneById(id);
  }

  // ======================== Private Helpers ========================

  private async findOneByIdOrFail(id: string): Promise<MessageModel> {
    const message = await this.messageRepository.findOneById(id);
    if (!message) {
      throw new NotFoundException({
        statusCode: EnumChatStatusCodeError.messageNotFound,
        message: 'message.error.notFound',
      });
    }
    return message;
  }
}
