import { Prisma } from '@/generated/prisma-client';
import { ConversationModel } from '../models/conversation.model';

export interface IConversationService {
  findAll(where?: Prisma.ConversationWhereInput): Promise<ConversationModel[]>;

  findOne(conversationId: string): Promise<ConversationModel | null>;

  findByParticipants(participants: string[]): Promise<ConversationModel | null>;

  getConversationsByUser(userId: string): Promise<ConversationModel[]>;

  create(participants: string[]): Promise<ConversationModel>;

  updateLastMessage(
    conversationId: string,
    messageId: string
  ): Promise<ConversationModel>;
}
