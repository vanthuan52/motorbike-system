import { Injectable, NotFoundException } from '@nestjs/common';
import { ISessionService } from '../interfaces/session.service.interface';
import { SessionRepository } from '../repository/session.repository';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import {
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { EnumSessionStatusCodeError } from '../enums/session.status-code.enum';
import { EnumSessionStatus } from '../enums/session.enum';
import { SessionUtil } from '../utils/session.util';
import { SessionDto } from '../dtos/session.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { HelperService } from '@/common/helper/services/helper.service';
import { DatabaseService } from '@/common/database/services/database.service';
import { SessionDoc } from '../entities/session.entity';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    private readonly sessionUtil: SessionUtil,
    private readonly sessionRepository: SessionRepository,
    private readonly helperService: HelperService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Retrieves a paginated list of active sessions for a user using offset-based pagination.
   */
  async getListOffset(
    userId: string,
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: SessionDoc[]; total: number }> {
    const find: Record<string, any> = {
      user: userId,
      ...where,
      ...status,
    };

    const [sessions, total] = await Promise.all([
      this.sessionRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.sessionRepository.getTotal(find),
    ]);

    return {
      data: sessions,
      total,
    };
  }

  /**
   * Get paginated list of sessions with cursor pagination
   */
  async getListCursor(
    userId: string,
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: SessionDoc[]; total?: number }> {
    const find: Record<string, any> = {
      user: userId,
      ...where,
      ...status,
    };

    const [data, count] = await Promise.all([
      this.sessionRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.sessionRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return {
      data: items,
      total: count,
    };
  }

  /**
   * Finds one active session by userId and sessionId.
   */
  async findOneActive(userId: string, sessionId: string): Promise<SessionDoc> {
    const today = this.helperService.dateCreate();
    const session = await this.sessionRepository.findOne<SessionDoc>({
      _id: sessionId,
      user: userId,
      status: EnumSessionStatus.active,
      ...this.databaseService.filterGte('expiredAt', today),
    });

    if (!session) {
      throw new NotFoundException({
        statusCode: EnumSessionStatusCodeError.notFound,
        message: 'session.error.notFound',
      });
    }

    return session;
  }

  /**
   * Updates the JTI (JWT ID) of a session.
   * @param id The ID of the session to update.
   * @param jti The new JTI value to set.
   */
  async updateJti(id: string, jti: string): Promise<void> {
    await this.sessionRepository.updateRaw(
      { _id: id },
      {
        $set: {
          jti,
        },
      },
    );
  }

  /**
   * Revokes a specific user session.
   */
  async revoke(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog,
  ): Promise<void> {
    const today = this.helperService.dateCreate();
    const session = await this.sessionRepository.findOne<SessionDoc>({
      _id: sessionId,
      user: userId,
      status: EnumSessionStatus.active,
      ...this.databaseService.filterGte('expiredAt', today),
    });

    if (!session) {
      throw new NotFoundException({
        statusCode: EnumSessionStatusCodeError.notFound,
        message: 'session.error.notFound',
      });
    }

    await Promise.all([
      this.sessionRepository.updateRaw(
        { _id: sessionId, user: userId },
        {
          $set: {
            status: EnumSessionStatus.revoked,
            revokeAt: today,
            updatedBy: userId,
          },
        },
      ),
      this.sessionUtil.deleteOneLogin(userId, sessionId),
    ]);
  }

  /**
   * Revokes a user session via admin action.
   */
  async revokeByAdmin(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog,
    revokeBy: string,
  ): Promise<void> {
    const today = this.helperService.dateCreate();
    const session = await this.sessionRepository.findOne<SessionDoc>({
      _id: sessionId,
      user: userId,
      status: EnumSessionStatus.active,
      ...this.databaseService.filterGte('expiredAt', today),
    });

    if (!session) {
      throw new NotFoundException({
        statusCode: EnumSessionStatusCodeError.notFound,
        message: 'session.error.notFound',
      });
    }

    await Promise.all([
      this.sessionRepository.updateRaw(
        { _id: sessionId },
        {
          $set: {
            status: EnumSessionStatus.revoked,
            revokeAt: today,
            updatedBy: revokeBy,
          },
        },
      ),
      this.sessionUtil.deleteOneLogin(userId, sessionId),
    ]);
  }

  async findAllByUser(userId: string): Promise<SessionDoc[]> {
    const sessions = await this.sessionRepository.findAll<SessionDoc>({
      user: userId,
    });
    return sessions;
  }
}
