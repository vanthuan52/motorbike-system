import { EnumMessageStatus, EnumMessageType } from '../enums/message.enum';
import { IMessageAttachment } from '../interfaces/message-attachment.interface';
import { ConversationModel } from './conversation.model';
import { UserModel } from '@/modules/user/models/user.model';

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
  isUnsent: boolean;
  attachments?: IMessageAttachment[];

  conversationId: string;
  conversation?: ConversationModel;
  senderId: string;
  sender?: UserModel;
  receiverId: string;
  receiver?: UserModel;

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
