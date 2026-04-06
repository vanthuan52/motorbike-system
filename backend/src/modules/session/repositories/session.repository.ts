import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ISessionListFilters } from '@/modules/session/interfaces/session.filter.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ISessionLoginCreate } from '@/modules/session/interfaces/session.interface';
import { SessionModel } from '@/modules/session/models/session.model';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { SessionMapper } from '../mappers/session.mapper';
import { Prisma, Session as PrismaSession } from '@/generated/prisma-client';

@Injectable()
export class SessionRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helperService: HelperService,
    private readonly paginationService: PaginationService,
    private readonly databaseUtil: DatabaseUtil
  ) {}

  async findWithPaginationOffsetByAdmin(
    userId: string,
    {
      where,
      ...others
    }: IPaginationQueryOffsetParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    filters?: ISessionListFilters
  ): Promise<IPaginationOffsetReturn<SessionModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaSession,
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >(this.databaseService.session, {
      ...others,
      where: {
        ...where,
        ...filters,
        userId,
      },
      include: {
        user: true,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => SessionMapper.toDomain(item)),
    };
  }

  async findActiveWithPaginationCursor(
    userId: string,
    {
      where,
      ...others
    }: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    filters?: ISessionListFilters
  ): Promise<IPaginationCursorReturn<SessionModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaSession,
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >(this.databaseService.session, {
      ...others,
      where: {
        ...where,
        ...filters,
        userId,
        isRevoked: false,
      },
      include: {
        user: true,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => SessionMapper.toDomain(item)),
    };
  }

  async findActive(userId: string): Promise<DatabaseIdDto[]> {
    return this.databaseService.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiredAt: {
          gte: this.helperService.dateCreate(),
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findActiveByDeviceOwnership(
    userId: string,
    deviceOwnershipId: string
  ): Promise<DatabaseIdDto[]> {
    return this.databaseService.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiredAt: {
          gte: this.helperService.dateCreate(),
        },
        deviceOwnershipId,
      },
      select: {
        id: true,
      },
    });
  }

  async findOneActive(
    userId: string,
    sessionId: string
  ): Promise<SessionModel> {
    const today = this.helperService.dateCreate();

    const session = await this.databaseService.session.findFirst({
      where: {
        id: sessionId,
        userId,
        expiredAt: {
          gte: today,
        },
        isRevoked: false,
      },
    });

    return SessionMapper.toDomain(session);
  }

  async revoke(userId: string, sessionId: string): Promise<SessionModel> {
    const session = await this.databaseService.session.update({
      where: {
        id: sessionId,
        userId,
      },
      data: {
        isRevoked: true,
        revokedAt: this.helperService.dateCreate(),
        revokedBy: {
          connect: {
            id: userId,
          },
        },
        updatedBy: userId,
      },
    });

    return SessionMapper.toDomain(session);
  }

  async revokeByAdmin(
    sessionId: string,
    revokedBy: string
  ): Promise<SessionModel> {
    const session = await this.databaseService.session.update({
      where: {
        id: sessionId,
      },
      data: {
        isRevoked: true,
        revokedAt: this.helperService.dateCreate(),
        revokedBy: {
          connect: {
            id: revokedBy,
          },
        },
        updatedBy: revokedBy,
      },
      include: {
        user: true,
      },
    });

    return SessionMapper.toDomain(session);
  }

  async revokeAllActive(
    userId: string,
    revokedAt: Date,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void> {
    const db = options?.tx || this.databaseService;
    await db.session.updateMany({
      where: {
        userId,
        isRevoked: false,
        expiredAt: {
          gte: revokedAt,
        },
      },
      data: {
        isRevoked: true,
        revokedAt,
        revokedById: userId,
      },
    });
  }

  async revokeByDeviceOwnership(
    deviceOwnershipId: string,
    revokedById: string
  ): Promise<void> {
    const revokedAt = this.helperService.dateCreate();
    await this.databaseService.session.updateMany({
      where: {
        deviceOwnershipId,
        isRevoked: false,
        expiredAt: {
          gte: revokedAt,
        },
      },
      data: {
        isRevoked: true,
        revokedAt,
        revokedById,
      },
    });
  }

  async createForLogin(
    userId: string,
    { sessionId, jti, expiredAt, deviceOwnershipId }: ISessionLoginCreate,
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void> {
    const db = options?.tx || this.databaseService;
    await db.session.create({
      data: {
        id: sessionId,
        jti,
        expiredAt,
        isRevoked: false,
        ipAddress,
        userAgent: this.databaseUtil.toPlainObject(userAgent),
        geoLocation: this.databaseUtil.toPlainObject(geoLocation),
        createdBy: userId,
        userId,
        deviceOwnershipId,
      },
    });
  }

  async updateJti(
    sessionId: string,
    jti: string,
    options?: { tx?: Prisma.TransactionClient }
  ): Promise<void> {
    const db = options?.tx || this.databaseService;
    await db.session.update({
      where: { id: sessionId },
      data: { jti },
    });
  }
}
