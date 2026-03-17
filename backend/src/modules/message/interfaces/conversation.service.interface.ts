import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
} from '@/common/database/interfaces/database.interface';
import { ConversationDoc } from '../entities/conversation.entity';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';

export interface IConversationService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ConversationDoc[] | null>;

  findOne(conversationId: string): Promise<ConversationDoc | null>;

  findByParticipants(participants: string[]): Promise<ConversationDoc | null>;

  getConversationsByUser(user: IUserDoc): Promise<ConversationDoc[]>;

  create(
    participants: string[],
    options?: IDatabaseCreateOptions,
  ): Promise<ConversationDoc>;

  mapConversations(conversation: ConversationDoc, user: IUserDoc): Promise<any>;
}
