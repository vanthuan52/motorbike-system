import { Injectable } from '@nestjs/common';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { ActivityLogDto } from '../dtos/activity-log.dto';
import { IActivityLogService } from '../interfaces/activity-log.service.interface';
import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { ActivityLogUtil } from '../utils/activity-log.util';

@Injectable()
export class ActivityLogService implements IActivityLogService {
  constructor(
    private readonly activityLogRepository: ActivityLogRepository,
    private readonly activityLogUtil: ActivityLogUtil,
  ) {}

  /**
   * Retrieves a paginated list of activity logs for a user using offset-based pagination.
   */
  async getListOffset(
    userId: string,
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
  ): Promise<IResponsePagingReturn<ActivityLogDto>> {
    const find: Record<string, any> = {
      user: userId,
      ...where,
    };

    const [activityLogs, total] = await Promise.all([
      this.activityLogRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.activityLogRepository.getTotal(find),
    ]);

    const mapped = this.activityLogUtil.mapList(activityLogs);
    const totalPage = Math.ceil(total / limit);
    const page = Math.floor(skip / limit) + 1;
    const hasNext = page < totalPage;
    const hasPrevious = page > 1;

    return {
      type: EnumPaginationType.offset,
      count: total,
      perPage: limit,
      page,
      totalPage,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: hasPrevious ? page - 1 : undefined,
      data: mapped,
    };
  }

  /**
   * Get paginated list of activity logs with cursor pagination
   */
  async getListCursor(
    userId: string,
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
  ): Promise<IResponsePagingReturn<ActivityLogDto>> {
    const find: Record<string, any> = {
      user: userId,
      ...where,
    };

    const [data, count] = await Promise.all([
      this.activityLogRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.activityLogRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    // Calculate cursor pagination metadata
    const hasNext = data.length > limit;
    const items = hasNext ? data.slice(0, limit) : data;
    const nextCursor =
      hasNext && items.length > 0 && cursorField
        ? String((items[items.length - 1] as any)[cursorField])
        : undefined;
    const mapped = this.activityLogUtil.mapList(items);

    return {
      type: EnumPaginationType.cursor,
      count,
      perPage: limit,
      hasNext,
      cursor: nextCursor,
      data: mapped,
    };
  }
}
