import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../repository/conversation.repository';
import { MessageRepository } from '../repository/message.repository';
import { UserService } from '@/modules/user/services/user.service';
import { IConversationService } from '../interfaces/conversation.service.interface';
import { Conversation, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
  ) {}

  async findAll(
    where?: Prisma.ConversationWhereInput,
  ): Promise<Conversation[]> {
    return this.conversationRepository.findMany(where || {});
  }

  async findOne(conversationId: string): Promise<Conversation | null> {
    return this.conversationRepository.findOneById(conversationId);
  }

  async mapConversations(
    conversation: Conversation,
    userId: string,
  ): Promise<any> {
    return {
      id: conversation.id,
      participants: conversation.participantIds,
      lastMessage: conversation.lastMessageId,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findMany({
      participantIds: {
        has: userId,
      },
    });
  }

  async findByParticipants(
    participants: string[],
  ): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      participantIds: {
        equals: participants,
      },
    });
  }

  async create(participants: string[]): Promise<Conversation> {
    return this.conversationRepository.create({
      participantIds: participants,
    });
  }
}

