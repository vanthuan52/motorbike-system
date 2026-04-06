import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ISessionListFilters } from './session.filter.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ISession, ISessionLoginCreate } from './session.interface';
import { SessionModel } from '../models/session.model';
import { Prisma } from '@/generated/prisma-client';

export interface ISessionService {
  getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    filters?: ISessionListFilters
  ): Promise<IPaginationOffsetReturn<SessionModel>>;
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >
  ): Promise<IPaginationCursorReturn<SessionModel>>;
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
