import { SendMessageDto } from '../dtos/request/send-message.dto';
import { Conversation, Message, Prisma } from '@/generated/prisma-client';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IMessageService {
  sendMessage(
    conversation: Conversation,
    payload: SendMessageDto
  ): Promise<Message>;

  findAllMessages(conversationId: string): Promise<Message[]>;
  markMessageRead(message: Message, readerId: string): Promise<Message>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<Message>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<Message>>;
}
