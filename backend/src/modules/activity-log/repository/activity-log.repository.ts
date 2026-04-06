import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { ActivityLogModel } from '../models/activity-log.model';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { ActivityLogMapper } from '../mappers/activity-log.mapper';
import {
  Prisma,
  ActivityLog as PrismaActivityLog,
} from '@/generated/prisma-client';

import { IActivityLogListFilters } from '../interfaces/activity-log.filter.interface';

@Injectable()
export class ActivityLogRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
    private readonly databaseUtil: DatabaseUtil
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IActivityLogListFilters
  ): Promise<IPaginationOffsetReturn<ActivityLogModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaActivityLog,
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >(this.databaseService.activityLog, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
      include: {
        user: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ActivityLogMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IActivityLogListFilters
  ): Promise<IPaginationCursorReturn<ActivityLogModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaActivityLog,
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >(this.databaseService.activityLog, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
      include: {
        user: true,
      },
      includeCount: true,
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ActivityLogMapper.toDomain(item)),
    };
  }

  async create(
    userId: string,
    action: EnumActivityLogAction,
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    metadata?: IActivityLogMetadata,
    options?: IDatabaseOptions
  ): Promise<ActivityLogModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.activityLog.create({
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

    return ActivityLogMapper.toDomain(result);
  }

  async getTotal(where: Prisma.ActivityLogWhereInput): Promise<number> {
    return this.databaseService.activityLog.count({
      where,
    });
  }
}
