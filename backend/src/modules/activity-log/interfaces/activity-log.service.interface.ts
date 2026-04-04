import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ActivityLogModel } from '../models/activity-log.model';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { Prisma } from '@/generated/prisma-client';
import { IActivityLogListFilters } from './activity-log.filter.interface';

export interface IActivityLogService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IActivityLogListFilters
  ): Promise<IPaginationOffsetReturn<ActivityLogModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IActivityLogListFilters
  ): Promise<IPaginationCursorReturn<ActivityLogModel>>;

  create(
    userId: string,
    action: EnumActivityLogAction,
    requestLog: IRequestLog,
    metadata?: IActivityLogMetadata,
    options?: IDatabaseOptions
  ): Promise<ActivityLogModel>;
}
