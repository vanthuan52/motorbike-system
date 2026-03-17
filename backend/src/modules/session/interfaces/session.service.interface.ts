import {
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { SessionDoc } from '../entities/session.entity';

export interface ISessionService {
  getListOffset(
    userId: string,
    pagination: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: SessionDoc[]; total: number }>;

  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: SessionDoc[]; total?: number }>;

  findOneActive(userId: string, sessionId: string): Promise<SessionDoc>;

  updateJti(id: string, jti: string): Promise<void>;

  revoke(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog,
  ): Promise<void>;

  revokeByAdmin(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog,
    revokeBy: string,
  ): Promise<void>;

  findAllByUser(userId: string): Promise<SessionDoc[]>;
}
