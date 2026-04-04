import { SendMessageDto } from '../dtos/request/send-message.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ConversationModel } from '../models/conversation.model';
import { MessageModel } from '../models/message.model';
import { Prisma } from '@/generated/prisma-client';
import { IMessageListFilters } from './message.filter.interface';

export interface IMessageService {
  sendMessage(
    conversation: ConversationModel,
    payload: SendMessageDto
  ): Promise<MessageModel>;

  findAllMessages(conversationId: string): Promise<MessageModel[]>;

  markMessageDelivered(messageId: string): Promise<MessageModel>;

  markMessageRead(
    message: MessageModel,
    readerId: string
  ): Promise<MessageModel>;

  softDeleteMessage(
    messageId: string,
    userId: string
  ): Promise<MessageModel>;

  unsendMessage(
    messageId: string,
    senderId: string
  ): Promise<MessageModel>;

  findOneById(id: string): Promise<MessageModel | null>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: IMessageListFilters
  ): Promise<IPaginationOffsetReturn<MessageModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: IMessageListFilters
  ): Promise<IPaginationCursorReturn<MessageModel>>;
}
