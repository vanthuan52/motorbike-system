import { ConversationModel } from '../models/conversation.model';
import { MessageMapper } from './message.mapper';
import { Conversation as PrismaConversation } from '@/generated/prisma-client';

export class ConversationMapper {
  static toDomain(prismaConversation: PrismaConversation): ConversationModel {
    const model = new ConversationModel();
    model.id = prismaConversation.id;
    model.participantIds = prismaConversation.participantIds;
    model.lastMessageId = prismaConversation.lastMessageId;

    model.createdAt = prismaConversation.createdAt;
    model.updatedAt = prismaConversation.updatedAt;
    model.deletedAt = prismaConversation.deletedAt;
    model.createdBy = prismaConversation.createdBy;
    model.updatedBy = prismaConversation.updatedBy;
    model.deletedBy = prismaConversation.deletedBy;

    if (
      prismaConversation.messages &&
      Array.isArray(prismaConversation.messages)
    ) {
      model.messages = prismaConversation.messages.map((m: any) =>
        MessageMapper.toDomain(m)
      );
    }

    return model;
  }
}
