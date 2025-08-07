import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { IChatService } from '../interfaces/chat.service.interface';
import { MessageDoc, MessageEntity } from '../entities/message.entity';

import { SendMessageDto } from '../dtos/request/send-message.dto';
import { ENUM_MESSAGE_STATUS } from '../enums/message.enum';
import { MessageRepository } from '../repository/message.repository';
import { ConversationRepository } from '../repository/conversation.repository';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
} from '@/common/database/interfaces/database.interface';
import {
  ConversationDoc,
  ConversationEntity,
} from '../entities/conversation.entity';
import {
  IUserDoc,
  IUserEntity,
} from '@/modules/user/interfaces/user.interface';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import { ConversationCreateRequestDto } from '../dtos/request/conversation-create-request.dto';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}
  async sendMessage(
    repository: ConversationDoc,
    { conversation, content, messageType, receiver, sender }: SendMessageDto,
    options?: IDatabaseCreateOptions,
  ) {
    const create: MessageEntity = new MessageEntity();
    create.conversation = conversation;
    create.content = content;
    create.messageType = messageType;
    create.receiver = receiver;
    create.sender = sender;
    create.status = ENUM_MESSAGE_STATUS.SENT;

    const savedMessage = await this.messageRepository.create(create, options);
    repository.lastMessage = savedMessage._id;
    repository.participants = repository.participants;

    await this.conversationRepository.save(repository, options);
    return this.messageRepository.create(create, options);
  }

  async findAllConversations(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ConversationDoc[] | null> {
    return this.conversationRepository.findAll<ConversationDoc>(find, options);
  }

  async findAllMessages(conversation: string): Promise<MessageDoc[] | null> {
    return this.messageRepository.findAll<MessageDoc>({
      conversation: conversation,
    });
  }
  async markMessageRead(repository: MessageDoc) {
    repository.status = ENUM_MESSAGE_STATUS.READ;
    return this.messageRepository.save(repository);
  }

  async findOneConversation(
    conversation: string,
  ): Promise<ConversationDoc | null> {
    return this.conversationRepository.findOneById<ConversationDoc>(
      conversation,
    );
  }
  mapConversations(
    conversation: ConversationDoc,
    user: IUserDoc,
  ): ConversationGetResponseDto {
    return plainToInstance(ConversationGetResponseDto, {
      _id: conversation._id,
      participants: conversation.participants,
      lastMessage: conversation.lastMessage,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  }

  async getConversationsByUser(user: IUserDoc): Promise<ConversationDoc[]> {
    return this.conversationRepository.findAll<ConversationDoc>({
      participants: user._id.toString(),
    });
  }

  async findByParticipants(
    participants: string[],
  ): Promise<ConversationDoc | null> {
    return this.conversationRepository.findOne<ConversationDoc>({
      participants: { $all: participants, $size: participants.length },
    });
  }

  async create(
    participants: string[],
    options?: IDatabaseCreateOptions,
  ): Promise<ConversationDoc> {
    const create: ConversationEntity = new ConversationEntity();
    create.participants = participants;
    return this.conversationRepository.create(create, options);
  }
}
