import { EnumMessageType, EnumMessageStatus } from '../enums/message.enum';

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
}
