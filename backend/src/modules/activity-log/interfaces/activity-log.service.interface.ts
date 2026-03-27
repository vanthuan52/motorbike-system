import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ActivityLogModel } from '../models/activity-log.model';
import { Prisma } from '@/generated/prisma-client';

export interface IActivityLogService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<ActivityLogModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<ActivityLogModel>>;
}
