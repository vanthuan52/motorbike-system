import { ConversationEntity } from '../entities/conversation.entity';
import { MessageEntity } from '../entities/message.entity';

export interface IMessageEntity extends Omit<MessageEntity, 'messages'> {
  messages: IMessageEntity;
}
export interface IMessageDoc extends Omit<MessageEntity, 'messages'> {
  messages: IMessageEntity[];
}

export interface IConversationEntity
  extends Omit<ConversationEntity, 'messages'> {
  messages: IMessageEntity[];
}

export interface IConversationDoc extends Omit<ConversationEntity, 'messages'> {
  messages: IMessageEntity[];
}
