import {
  IPaginationEqual,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { Prisma } from '@/generated/prisma-client';
import { ISession } from './session.interface';

export interface ISessionService {
  getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<ISession>>;
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >
  ): Promise<IPaginationCursorReturn<ISession>>;
  revoke(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog
  ): Promise<void>;
  revokeByAdmin(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog,
    revokedBy: string
  ): Promise<ISession>;
}
