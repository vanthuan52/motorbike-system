import {
  IPaginationEqual,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import {
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
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
  ): Promise<{ data: ISession[]; total: number }>;
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >
  ): Promise<{ data: ISession[]; total?: number }>;
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
