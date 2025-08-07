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
import { ConversationDoc } from '../entities/conversation.entity';
import {
  IUserDoc,
  IUserEntity,
} from '@/modules/user/interfaces/user.interface';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';

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
  mapConversations(user: IUserDoc | IUserEntity): ConversationGetResponseDto {
    const isMongooseDoc = (u: any): u is Document =>
      u && typeof u.toObject === 'function';
    return plainToInstance(
      ConversationGetResponseDto,
      isMongooseDoc(user) ? user.toObject() : user,
    );
  }
}
