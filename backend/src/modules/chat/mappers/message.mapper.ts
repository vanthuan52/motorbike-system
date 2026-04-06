import { MessageModel } from '../models/message.model';
import { EnumMessageStatus, EnumMessageType } from '../enums/message.enum';
import { ConversationMapper } from './conversation.mapper';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { Message as PrismaMessage } from '@/generated/prisma-client';

export class MessageMapper {
  static toDomain(prismaMessage: PrismaMessage): MessageModel {
    const model = new MessageModel();
    model.id = prismaMessage.id;
    model.content = prismaMessage.content;
    model.messageType = prismaMessage.messageType as EnumMessageType;
    model.timestamp = prismaMessage.timestamp;
    model.status = prismaMessage.status as EnumMessageStatus;
    model.readBy = prismaMessage.readBy;
    model.isUnsent = prismaMessage.isUnsent ?? false;
    model.attachments = prismaMessage.attachments ?? undefined;
    model.conversationId = prismaMessage.conversationId;
    model.senderId = prismaMessage.senderId;
    model.receiverId = prismaMessage.receiverId;

    model.createdAt = prismaMessage.createdAt;
    model.updatedAt = prismaMessage.updatedAt;
    model.deletedAt = prismaMessage.deletedAt;
    model.createdBy = prismaMessage.createdBy;
    model.updatedBy = prismaMessage.updatedBy;
    model.deletedBy = prismaMessage.deletedBy;

    if (prismaMessage.conversation) {
      model.conversation = ConversationMapper.toDomain(
        prismaMessage.conversation
      );
    }
    if (prismaMessage.sender) {
      model.sender = UserMapper.toDomain(prismaMessage.sender);
    }
    if (prismaMessage.receiver) {
      model.receiver = UserMapper.toDomain(prismaMessage.receiver);
    }

    return model;
  }
}
