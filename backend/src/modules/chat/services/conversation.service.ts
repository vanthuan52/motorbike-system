import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../repository/conversation.repository';
import { IConversationService } from '../interfaces/conversation.service.interface';
import { ConversationModel } from '../models/conversation.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository
  ) {}

  async findAll(
    where?: Prisma.ConversationWhereInput
  ): Promise<ConversationModel[]> {
    return this.conversationRepository.findMany(where || {});
  }

  async findOne(conversationId: string): Promise<ConversationModel | null> {
    return this.conversationRepository.findOneById(conversationId);
  }

  async getConversationsByUser(userId: string): Promise<ConversationModel[]> {
    return this.conversationRepository.findMany({
      participantIds: {
        has: userId,
      },
    });
  }

  async findByParticipants(
    participants: string[]
  ): Promise<ConversationModel | null> {
    return this.conversationRepository.findOne({
      participantIds: {
        equals: participants,
      },
    });
  }

  async create(participants: string[]): Promise<ConversationModel> {
    return this.conversationRepository.create({
      participantIds: participants,
    });
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string
  ): Promise<ConversationModel> {
    return this.conversationRepository.update(conversationId, {
      lastMessageId: messageId,
    });
  }
}
