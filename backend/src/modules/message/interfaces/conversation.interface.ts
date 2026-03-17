import {
  ConversationDoc,
  ConversationEntity,
} from '../entities/conversation.entity';
import { IMessageEntity } from './message.interface';

export interface IConversationEntity extends Omit<
  ConversationEntity,
  'messages'
> {
  messages: IMessageEntity[];
}

export interface IConversationDoc extends Omit<ConversationDoc, 'messages'> {
  messages: IMessageEntity[];
}
