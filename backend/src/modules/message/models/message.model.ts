import { EnumMessageType, EnumMessageStatus } from '../enums/message.enum';

/**
 * Domain model representing a chat message.
 * Maps from Prisma Message to application domain layer.
 */
export class MessageModel {
  id: string;
  content: string;
  messageType: EnumMessageType;
  timestamp: Date;
  status: EnumMessageStatus;
  readBy: string[];

  conversationId: string;
  senderId: string;
  receiverId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<MessageModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
