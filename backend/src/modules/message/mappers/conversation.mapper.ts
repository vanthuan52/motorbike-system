import { ConversationModel } from '../models/conversation.model';

export class ConversationMapper {
  static toDomain(prismaConversation: any): ConversationModel {
    const model = new ConversationModel();
    model.id = prismaConversation.id;
    model.participants = prismaConversation.participants;
    model.lastMessage = prismaConversation.lastMessage;

    model.createdAt = prismaConversation.createdAt;
    model.updatedAt = prismaConversation.updatedAt;
    model.deletedAt = prismaConversation.deletedAt;
    model.createdBy = prismaConversation.createdBy;
    model.updatedBy = prismaConversation.updatedBy;
    model.deletedBy = prismaConversation.deletedBy;

    return model;
  }
}
