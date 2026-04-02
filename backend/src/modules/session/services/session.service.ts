import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ISessionListFilters } from '@/modules/session/interfaces/session.filter.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { EnumSessionStatusCodeError } from '@/modules/session/enums/session.status-code.enum';
import { ISessionService } from '@/modules/session/interfaces/session.service.interface';
import { SessionRepository } from '@/modules/session/repositories/session.repository';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { ISession, ISessionLoginCreate } from '../interfaces/session.interface';
import { ActivityLogService } from '@/modules/activity-log/services/activity-log.service';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { SessionModel } from '../models/session.model';
import { Prisma } from '@/generated/prisma-client';

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
    private readonly sessionUtil: SessionUtil,
    private readonly activityLogService: ActivityLogService
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
    filters?: ISessionListFilters
  ): Promise<IPaginationOffsetReturn<SessionModel>> {
    const { data, ...others } =
      await this.sessionRepository.findWithPaginationOffsetByAdmin(
        userId,
        pagination,
        filters
      );

    return { data, ...others };
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
  ): Promise<IPaginationCursorReturn<SessionModel>> {
    const { data, ...others } =
      await this.sessionRepository.findActiveWithPaginationCursor(
        userId,
        pagination
      );

    return { data, ...others };
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
      this.sessionRepository.revoke(userId, sessionId),
      this.activityLogService.create(
        userId,
        EnumActivityLogAction.userRevokeSession,
        requestLog
      ),
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
      this.sessionRepository.revokeByAdmin(sessionId, revokedBy),
      this.activityLogService.create(
        revokedBy,
        EnumActivityLogAction.userRevokeSessionByAdmin,
        requestLog
      ),
      this.sessionUtil.deleteOneLogin(userId, sessionId),
    ]);

    return removed;
  }

  /**
   * Revokes all active user sessions from the database
   */
  async revokeAllActive(
    userId: string,
    revokedAt: Date,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void> {
    await this.sessionRepository.revokeAllActive(userId, revokedAt, options);
  }

  // =========================== Cross-module service calls ==============================

  async createForLogin(
    userId: string,
    sessionData: ISessionLoginCreate,
    requestLog: IRequestLog,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void> {
    await this.sessionRepository.createForLogin(
      userId,
      sessionData,
      requestLog,
      options
    );
  }

  async findActive(userId: string): Promise<DatabaseIdDto[]> {
    return this.sessionRepository.findActive(userId);
  }

  async findActiveByDeviceOwnership(
    userId: string,
    deviceOwnershipId: string
  ): Promise<DatabaseIdDto[]> {
    return this.sessionRepository.findActiveByDeviceOwnership(
      userId,
      deviceOwnershipId
    );
  }

  async revokeByDeviceOwnership(
    deviceOwnershipId: string,
    revokedById: string
  ): Promise<void> {
    await this.sessionRepository.revokeByDeviceOwnership(
      deviceOwnershipId,
      revokedById
    );
  }

  async updateJti(
    sessionId: string,
    jti: string,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void> {
    await this.sessionRepository.updateJti(sessionId, jti, options);
  }
}
