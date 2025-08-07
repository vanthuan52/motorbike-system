import { MessageEntity } from '../entities/message.entity';

export interface IMessageEntity extends Omit<MessageEntity, 'messages'> {
  messages: IMessageEntity;
}
export interface IMessageDoc extends Omit<MessageEntity, 'messages'> {
  messages: IMessageEntity[];
}
