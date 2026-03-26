import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SendMessageDto } from '../dtos/request/send-message.dto';
import { EnumMessageStatus } from '../enums/message.enum';
import { MessageRepository } from '../repository/message.repository';
import { ConversationRepository } from '../repository/conversation.repository';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import { MessageUpdateStatusRequestDto } from '../dtos/request/message-update-status.request.dto';
import { UserService } from '@/modules/user/services/user.service';
import { IMessageService } from '../interfaces/message.service.interface';
import { MessageModel } from '../models/message.model';
import { ConversationModel } from '../models/conversation.model';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService
  ) {}

  async sendMessage(
    conversation: ConversationModel,
    { content, messageType, receiver, sender }: SendMessageDto
  ): Promise<MessageModel> {
    const savedMessage = await this.messageRepository.create({
      conversation: { connect: { id: conversation.id } },
      content,
      messageType,
      receiver: { connect: { id: receiver } },
      sender: { connect: { id: sender } },
      status: EnumMessageStatus.sent,
      readBy: [sender],
    });

    await this.conversationRepository.update(conversation.id, {
      lastMessageId: savedMessage.id,
    });

    return savedMessage;
  }

  async findAllMessages(conversationId: string): Promise<MessageModel[]> {
    return this.messageRepository.findMany({
      conversationId: conversationId,
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
      status:
        message.status !== EnumMessageStatus.read
          ? EnumMessageStatus.read
          : undefined,
    });
  }

  async create(participants: string[]): Promise<ConversationModel> {
    return this.conversationRepository.create({
      participantIds: participants,
    });
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<MessageModel>> {
    const { data, ...others } =
      await this.messageRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<MessageModel>> {
    const { data, ...others } =
      await this.messageRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async findOneById(id: string): Promise<MessageModel | null> {
    return this.messageRepository.findOneById(id);
  }

  mapListMessage(messages: MessageModel[]): MessageGetResponseDto[] {
    return plainToInstance(MessageGetResponseDto, messages);
  }

  async updateStatusMessage(
    message: MessageModel,
    { status }: MessageUpdateStatusRequestDto
  ): Promise<MessageModel> {
    return this.messageRepository.update(message.id, {
      status,
    });
  }
}
