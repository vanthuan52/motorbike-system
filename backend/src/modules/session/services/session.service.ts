import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IPaginationEqual,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import {
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { EnumSessionStatusCodeError } from '@/modules/session/enums/session.status-code.enum';
import { ISessionService } from '@/modules/session/interfaces/session.service.interface';
import { SessionRepository } from '@/modules/session/repositories/session.repository';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { Prisma } from '@/generated/prisma-client';
import { ISession } from '../interfaces/session.interface';

/**
 * Session Management Service
 *
 * Provides session operations including retrieving active sessions with pagination,
 * revoking user sessions, and revoking sessions via admin action.
 * Manages both cache and database persistence for session data.
 */
@Injectable()
export class SessionService implements ISessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionUtil: SessionUtil
  ) {}

  /**
   * Retrieves a paginated list of active sessions for a user using offset-based pagination.
   *
   * @param userId - The unique identifier of the user
   * @param pagination - Offset pagination parameters (limit, offset, orderBy, where)
   * @returns Paginated session data with pagination metadata (count, page, totalPage, hasNext, hasPrevious)
   */
  async getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<{ data: ISession[]; total: number }> {
    const { data, count } = await this.sessionRepository.findWithPaginationOffsetByAdmin(
      userId,
      pagination,
      isRevoked
    );
    return { data, total: count || 0 };
  }

  /**
   * Retrieves a paginated list of active sessions for a user using cursor-based pagination.
   *
   * @param userId - The unique identifier of the user
   * @param pagination - Cursor pagination parameters (cursor, first/last, orderBy, where)
   * @returns Paginated session data with pagination metadata and cursor for next page
   */
  async getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >
  ): Promise<{ data: ISession[]; total?: number }> {
    const { data, count } = await this.sessionRepository.findActiveWithPaginationCursor(
      userId,
      pagination
    );
    return { data, total: count || 0 };
  }

  /**
   * Revokes a specific user session from both database and cache.
   *
   * @param userId - The unique identifier of the user
   * @param sessionId - The unique identifier of the session to revoke
   * @param requestLog - Request log information for audit trail
   * @returns Empty response indicating successful revocation
   * @throws {NotFoundException} If session does not exist or is not active
   */
  async revoke(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog
  ): Promise<void> {
    const checkActive = await this.sessionRepository.findOneActive(
      userId,
      sessionId
    );
    if (!checkActive) {
      throw new NotFoundException({
        statusCode: EnumSessionStatusCodeError.notFound,
        message: 'session.error.notFound',
      });
    }

    await Promise.all([
      this.sessionRepository.revoke(userId, sessionId, requestLog),
      this.sessionUtil.deleteOneLogin(userId, sessionId),
    ]);
  }

  /**
   * Revokes a user session via admin action with audit tracking.
   *
   * @param userId - The unique identifier of the user
   * @param sessionId - The unique identifier of the session to revoke
   * @param requestLog - Request log information for audit trail
   * @param revokedBy - The identifier of admin/user who initiated the revocation
   * @returns Response with activity log metadata for audit trail
   * @throws {NotFoundException} If session does not exist or is not active
   */
  async revokeByAdmin(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog,
    revokedBy: string
  ): Promise<ISession> {
    const checkActive = await this.sessionRepository.findOneActive(
      userId,
      sessionId
    );
    if (!checkActive) {
      throw new NotFoundException({
        statusCode: EnumSessionStatusCodeError.notFound,
        message: 'session.error.notFound',
      });
    }

    const [removed] = await Promise.all([
      this.sessionRepository.revokeByAdmin(sessionId, requestLog, revokedBy),
      this.sessionUtil.deleteOneLogin(userId, sessionId),
    ]);

    return removed;
  }
}
