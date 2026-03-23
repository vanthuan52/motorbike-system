import { Conversation, Prisma } from '@/generated/prisma-client';

export interface IConversationService {
  findAll(where?: Prisma.ConversationWhereInput): Promise<Conversation[]>;

  findOne(conversationId: string): Promise<Conversation | null>;

  findByParticipants(participants: string[]): Promise<Conversation | null>;

  getConversationsByUser(userId: string): Promise<Conversation[]>;

  create(participants: string[]): Promise<Conversation>;

  mapConversations(conversation: Conversation, userId: string): Promise<any>;
}
