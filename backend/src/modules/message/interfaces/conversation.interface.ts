import { Conversation, Message } from '@/generated/prisma-client';
import { IMessageEntity } from './message.interface';

export interface IConversationEntity extends Conversation {
  messages?: IMessageEntity[];
}

export interface IConversationDoc extends Conversation {
  messages?: IMessageEntity[];
}
