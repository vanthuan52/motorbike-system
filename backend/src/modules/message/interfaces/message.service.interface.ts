import { SendMessageDto } from '../dtos/request/send-message.dto';
import { Conversation, Message } from '@/generated/prisma-client';

export interface IMessageService {
  sendMessage(
    conversation: Conversation,
    payload: SendMessageDto
  ): Promise<Message>;

  findAllMessages(conversationId: string): Promise<Message[]>;
  markMessageRead(message: Message, readerId: string): Promise<Message>;
}
