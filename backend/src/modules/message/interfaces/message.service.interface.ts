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

export interface IMessageService {
  sendMessage(
    conversation: ConversationModel,
    payload: SendMessageDto
  ): Promise<MessageModel>;

  findAllMessages(conversationId: string): Promise<MessageModel[]>;
  markMessageRead(
    message: MessageModel,
    readerId: string
  ): Promise<MessageModel>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<MessageModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<MessageModel>>;
}
