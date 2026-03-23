import { MessageModel } from '../models/message.model';
import { EnumMessageType, EnumMessageStatus } from '../enums/message.enum';

export class MessageMapper {
  static toDomain(prismaMessage: any): MessageModel {
    const model = new MessageModel();
    model.id = prismaMessage.id;
    model.content = prismaMessage.content;
    model.messageType = prismaMessage.messageType?.toLowerCase() as EnumMessageType;
    model.timestamp = prismaMessage.timestamp;
    model.status = prismaMessage.status?.toLowerCase() as EnumMessageStatus;
    model.readBy = prismaMessage.readBy;
    model.conversationId = prismaMessage.conversationId;
    model.senderId = prismaMessage.senderId;
    model.receiverId = prismaMessage.receiverId;

    model.createdAt = prismaMessage.createdAt;
    model.updatedAt = prismaMessage.updatedAt;
    model.deletedAt = prismaMessage.deletedAt;
    model.createdBy = prismaMessage.createdBy;
    model.updatedBy = prismaMessage.updatedBy;
    model.deletedBy = prismaMessage.deletedBy;

    return model;
  }
}
