import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ActivityLogResponseDto } from '@/modules/activity-log/dtos/response/activity-log.response.dto';
import { Prisma } from '@/generated/prisma-client';

export interface IActivityLogService {
  getListOffset(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<{ data: ActivityLogResponseDto[]; total: number }>;
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<{ data: ActivityLogResponseDto[]; total: number }>;
}
