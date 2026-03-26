import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SendMessageDto } from '../dtos/request/send-message.dto';
import { EnumMessageStatus } from '../enums/message.enum';
import { MessageRepository } from '../repository/message.repository';
import { ConversationRepository } from '../repository/conversation.repository';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import { IMessageEntity } from '../interfaces/message.interface';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import { MessageUpdateStatusRequestDto } from '../dtos/request/message-update-status.request.dto';
import { UserService } from '@/modules/user/services/user.service';
import { IMessageService } from '../interfaces/message.service.interface';
import { Conversation, Message, Prisma } from '@/generated/prisma-client';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService
  ) {}

  async sendMessage(
    conversation: Conversation,
    { content, messageType, receiver, sender }: SendMessageDto
  ): Promise<Message> {
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

  async findAllMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepository.findMany({
      conversationId: conversationId,
    });
  }

  async markMessageRead(message: Message, readerId: string): Promise<Message> {
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

  async create(participants: string[]): Promise<Conversation> {
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
  ): Promise<IPaginationOffsetReturn<Message>> {
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
  ): Promise<IPaginationCursorReturn<Message>> {
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

  async findOneById(id: string): Promise<Message | null> {
    return this.messageRepository.findOneById(id);
  }

  mapListMessage(messages: Message[]): MessageGetResponseDto[] {
    return plainToInstance(MessageGetResponseDto, messages);
  }

  async updateStatusMessage(
    message: Message,
    { status }: MessageUpdateStatusRequestDto
  ): Promise<Message> {
    return this.messageRepository.update(message.id, {
      status,
    });
  }
}
