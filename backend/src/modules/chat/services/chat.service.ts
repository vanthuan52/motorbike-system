import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IChatService } from '../interfaces/chat.service.interface';
import { MessageDoc, MessageEntity } from '../entities/message.entity';

import { SendMessageDto } from '../dtos/request/send-message.dto';
import { ENUM_MESSAGE_STATUS } from '../enums/message.enum';
import { MessageRepository } from '../repository/message.repository';
import { ConversationRepository } from '../repository/conversation.repository';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  ConversationDoc,
  ConversationEntity,
} from '../entities/conversation.entity';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import { IMessageEntity } from '../interfaces/chat.interface';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import { MessageSharedUpdateStatusRequestDto } from '../dtos/request/message-update-stauts.request.dto';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
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
    create.readBy = [sender];

    const savedMessage = await this.messageRepository.create(create, options);
    repository.lastMessage = savedMessage._id;
    repository.participants = repository.participants;

    await this.conversationRepository.save(repository, options);

    return savedMessage;
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

  async markMessageRead(repository: MessageDoc, readerId: string) {
    if (!repository.readBy) {
      repository.readBy = [];
    }

    if (!repository.readBy.includes(readerId)) {
      repository.readBy.push(readerId);
    }

    if (repository.status !== ENUM_MESSAGE_STATUS.READ) {
      repository.status = ENUM_MESSAGE_STATUS.READ;
    }

    return this.messageRepository.save(repository);
  }

  async findOneConversation(
    conversation: string,
  ): Promise<ConversationDoc | null> {
    return this.conversationRepository.findOneById<ConversationDoc>(
      conversation,
    );
  }
  async mapConversations(
    conversation: ConversationDoc,
    user: IUserDoc,
  ): Promise<any> {
    const users = await this.userService.findAll({
      _id: { $in: conversation.participants },
    });

    const participants = users.map((u) => ({
      _id: u._id,
      username: u.name,
      name: u.name,
      email: u.email,
    }));

    return {
      _id: conversation._id,
      participants,
      lastMessage: conversation.lastMessage,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
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

  async findAllMessagesWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IMessageEntity[]> {
    return this.messageRepository.findAll<IMessageEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.messageRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<MessageDoc | null> {
    return this.messageRepository.findOneById<MessageDoc>(_id, options);
  }

  mapListMessage(
    message: MessageDoc[] | IMessageEntity[],
  ): MessageGetResponseDto[] {
    return plainToInstance(
      MessageGetResponseDto,
      message.map((p: MessageDoc | IMessageEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  async updateStatusMessage(
    repository: MessageDoc,
    { status }: MessageSharedUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MessageDoc> {
    repository.status = status;

    return this.messageRepository.save(repository, options);
  }
}
