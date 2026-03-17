import { Injectable } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
} from '@/common/database/interfaces/database.interface';
import {
  ConversationDoc,
  ConversationEntity,
} from '../entities/conversation.entity';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { ConversationRepository } from '../repository/conversation.repository';
import { MessageRepository } from '../repository/message.repository';
import { MessageDoc } from '../entities/message.entity';
import { UserService } from '@/modules/user/services/user.service';
import { IConversationService } from '../interfaces/conversation.service.interface';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ConversationDoc[] | null> {
    return this.conversationRepository.findAll<ConversationDoc>(find, options);
  }

  async findOne(conversation: string): Promise<ConversationDoc | null> {
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
    const lastMessage = conversation.lastMessage
      ? await this.messageRepository.findOneById<MessageDoc>(
          conversation.lastMessage,
        )
      : null;
    return {
      _id: conversation._id,
      participants,
      lastMessage: lastMessage,
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
}
