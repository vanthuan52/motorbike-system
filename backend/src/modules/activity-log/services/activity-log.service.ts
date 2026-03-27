import { Injectable } from '@nestjs/common';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IActivityLogService } from '@/modules/activity-log/interfaces/activity-log.service.interface';
import { ActivityLogRepository } from '@/modules/activity-log/repository/activity-log.repository';
import { ActivityLogUtil } from '@/modules/activity-log/utils/activity-log.util';
import { ActivityLogModel } from '../models/activity-log.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class ActivityLogService implements IActivityLogService {
  constructor(
    private readonly activityRepository: ActivityLogRepository,
    private readonly activityUtil: ActivityLogUtil
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: Record<string, IPaginationIn>
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
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<ActivityLogModel>> {
    return this.activityRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }
}
