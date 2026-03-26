import { Injectable } from '@nestjs/common';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IActivityLogService } from '@/modules/activity-log/interfaces/activity-log.service.interface';
import { ActivityLogRepository } from '@/modules/activity-log/repositories/activity-log.repository';
import { ActivityLogUtil } from '@/modules/activity-log/utils/activity-log.util';
import { ActivityLog, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ActivityLogService implements IActivityLogService {
  constructor(
    private readonly activityRepository: ActivityLogRepository,
    private readonly activityUtil: ActivityLogUtil
  ) {}

  async getListOffset(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<IPaginationOffsetReturn<ActivityLog>> {
    const { data, ...others } =
      await this.activityRepository.findWithPaginationOffset(
        userId,
        pagination
      );

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<IPaginationCursorReturn<ActivityLog>> {
    const { data, ...others } =
      await this.activityRepository.findWithPaginationCursor(
        userId,
        pagination
      );

    return {
      data,
      ...others,
    };
  }
}
