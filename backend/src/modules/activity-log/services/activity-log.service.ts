import { Injectable } from '@nestjs/common';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ActivityLogResponseDto } from '@/modules/activity-log/dtos/response/activity-log.response.dto';
import { IActivityLogService } from '@/modules/activity-log/interfaces/activity-log.service.interface';
import { ActivityLogRepository } from '@/modules/activity-log/repositories/activity-log.repository';
import { ActivityLogUtil } from '@/modules/activity-log/utils/activity-log.util';
import { Prisma } from '@/generated/prisma-client';

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
  ): Promise<{ data: ActivityLogResponseDto[]; total: number }> {
    const { data, count } =
      await this.activityRepository.findWithPaginationOffset(
        userId,
        pagination
      );

    const activityLogs: ActivityLogResponseDto[] =
      this.activityUtil.mapList(data);
    return {
      data: activityLogs,
      total: count || 0,
    };
  }

  async getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<{ data: ActivityLogResponseDto[]; total: number }> {
    const { data, count } =
      await this.activityRepository.findWithPaginationCursor(
        userId,
        pagination
      );

    const activityLogs: ActivityLogResponseDto[] =
      this.activityUtil.mapList(data);
    return {
      data: activityLogs,
      total: count || 0,
    };
  }
}
