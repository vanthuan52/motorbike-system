import { Injectable } from '@nestjs/common';
import {
  IPaginationCursorReturn,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IActivityLogService } from '@/modules/activity-log/interfaces/activity-log.service.interface';
import { ActivityLogRepository } from '@/modules/activity-log/repository/activity-log.repository';
import { ActivityLogModel } from '../models/activity-log.model';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { Prisma } from '@/generated/prisma-client';

import { IActivityLogListFilters } from '../interfaces/activity-log.filter.interface';

@Injectable()
export class ActivityLogService implements IActivityLogService {
  constructor(private readonly activityRepository: ActivityLogRepository) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IActivityLogListFilters
  ): Promise<IPaginationOffsetReturn<ActivityLogModel>> {
    return this.activityRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IActivityLogListFilters
  ): Promise<IPaginationCursorReturn<ActivityLogModel>> {
    return this.activityRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async create(
    userId: string,
    action: EnumActivityLogAction,
    requestLog: IRequestLog,
    metadata?: IActivityLogMetadata,
    options?: IDatabaseOptions
  ): Promise<ActivityLogModel> {
    return this.activityRepository.create(
      userId,
      action,
      requestLog,
      metadata,
      options
    );
  }
}
