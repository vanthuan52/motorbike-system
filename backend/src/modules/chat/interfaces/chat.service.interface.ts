import { IDatabaseCreateOptions } from '@/common/database/interfaces/database.interface';
import { SendMessageDto } from '../dtos/request/send-message.dto';
import { ConversationDoc } from '../entities/conversation.entity';
import { MessageDoc } from '../entities/message.entity';

export interface IChatService {
  sendMessage(
    repository: ConversationDoc,
    payload: SendMessageDto,
    options?: IDatabaseCreateOptions,
  ): Promise<MessageDoc>;

  findAllMessages(conversationId: string): Promise<MessageDoc[] | null>;
  findAllConversations(): Promise<ConversationDoc[] | null>;
  markMessageRead(
    messageDoc: MessageDoc,
    readerId: string,
  ): Promise<MessageDoc>;
  findOneConversation(conversationId: string): Promise<ConversationDoc | null>;
}
