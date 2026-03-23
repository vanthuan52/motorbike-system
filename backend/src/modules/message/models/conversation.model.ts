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
}
