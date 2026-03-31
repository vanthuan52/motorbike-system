/**
 * Domain model representing a conversation between participants.
 * Maps from Prisma Conversation to application domain layer.
 */
export class ConversationModel {
  id: string;
  participants: string[];
  lastMessage?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<ConversationModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
