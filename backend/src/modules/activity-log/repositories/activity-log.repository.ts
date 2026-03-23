import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import {
  ActivityLog,
  EnumActivityLogAction,
  Prisma,
} from '@/generated/prisma-client';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';

@Injectable()
export class ActivityLogRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
    private readonly databaseUtil: DatabaseUtil
  ) {}

  async findMany(
    userId: string,
    {
      where: baseWhere,
      skip,
      limit,
      orderBy,
      ...rest
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<ActivityLog[]> {
    const mergedWhere: Prisma.ActivityLogWhereInput = {
      ...baseWhere,
      userId,
    };

    return this.databaseService.activityLog.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || [
        { createdAt: EnumPaginationOrderDirectionType.desc },
      ],
      ...rest,
    });
  }

  async getTotal({
    where: baseWhere,
  }: IPaginationQueryOffsetParams<
    Prisma.ActivityLogSelect,
    Prisma.ActivityLogWhereInput
  >): Promise<number> {
    const mergedWhere: Prisma.ApiKeyWhereInput = {
      ...baseWhere,
    };

    return this.databaseService.activityLog.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset(
    userId: string,
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<{
    data: ActivityLog[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<ActivityLog>(
      this.databaseService.activityLog,
      {
        ...params,
        where: {
          ...where,
          userId,
        },
        include: {
          user: true,
        },
      }
    );
  }

  async findWithPaginationCursor(
    userId: string,
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<{
    data: ActivityLog[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<ActivityLog>(
      this.databaseService.activityLog,
      {
        ...params,
        where: {
          ...where,
          userId,
        },
        include: {
          user: true,
        },
        includeCount: true,
      }
    );
  }

  async create(
    userId: string,
    action: EnumActivityLogAction,
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    metadata?: IActivityLogMetadata
  ): Promise<ActivityLog> {
    return this.databaseService.activityLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent: this.databaseUtil.toPlainObject(userAgent),
        geoLocation: this.databaseUtil.toPlainObject(geoLocation),
        metadata:
          metadata && Object.keys(metadata).length > 0
            ? (metadata as Prisma.InputJsonValue)
            : null,
        createdBy: userId,
      },
    });
  }
}
