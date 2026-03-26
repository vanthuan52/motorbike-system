import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ActivityLog, Prisma } from '@/generated/prisma-client';

export interface IActivityLogService {
  getListOffset(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<IPaginationOffsetReturn<ActivityLog>>;
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >
  ): Promise<IPaginationCursorReturn<ActivityLog>>;
}
