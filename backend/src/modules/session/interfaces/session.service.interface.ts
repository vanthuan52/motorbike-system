import {
  IPaginationEqual,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ISession, ISessionLoginCreate } from './session.interface';
import { Prisma } from '@/generated/prisma-client';

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
  revokeAllActive(
    userId: string,
    revokedAt: Date,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void>;
  createForLogin(
    userId: string,
    sessionData: ISessionLoginCreate,
    requestLog: IRequestLog,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void>;
  findActive(userId: string): Promise<{ id: string }[]>;
  findActiveByDeviceOwnership(
    userId: string,
    deviceOwnershipId: string
  ): Promise<{ id: string }[]>;
  revokeByDeviceOwnership(
    deviceOwnershipId: string,
    revokedById: string
  ): Promise<void>;
  updateJti(
    sessionId: string,
    jti: string,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void>;
}

