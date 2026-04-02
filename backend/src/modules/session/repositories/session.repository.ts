import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IPaginationEqual,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ISession } from '@/modules/session/interfaces/session.interface';
import { SessionModel } from '@/modules/session/models/session.model';
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
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<SessionModel>> {
    return this.paginationService.offset<
      PrismaSession,
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >(this.databaseService.session, {
      ...others,
      where: {
        ...where,
        ...isRevoked,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findActiveWithPaginationCursor(
    userId: string,
    {
      where,
      ...others
    }: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >
  ): Promise<IPaginationCursorReturn<SessionModel>> {
    return this.paginationService.cursor<
      PrismaSession,
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >(this.databaseService.session, {
      ...others,
      where: {
        ...where,
        userId,
        isRevoked: false,
      },
      include: {
        user: true,
      },
    });
  }

  async findActive(userId: string): Promise<
    {
      id: string;
    }[]
  > {
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
  ): Promise<
    {
      id: string;
    }[]
  > {
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

    return this.databaseService.session.findFirst({
      where: {
        id: sessionId,
        userId,
        expiredAt: {
          gte: today,
        },
        isRevoked: false,
      },
    });
  }

  async revoke(userId: string, sessionId: string): Promise<SessionModel> {
    return this.databaseService.session.update({
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
  }

  async revokeByAdmin(sessionId: string, revokedBy: string): Promise<ISession> {
    return this.databaseService.session.update({
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
    {
      sessionId,
      jti,
      expiredAt,
      deviceOwnershipId,
    }: {
      sessionId: string;
      jti: string;
      expiredAt: Date;
      deviceOwnershipId: string;
    },
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
}
