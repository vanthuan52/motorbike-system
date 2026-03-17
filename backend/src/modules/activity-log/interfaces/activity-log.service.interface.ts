import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ActivityLogDto } from '../dtos/activity-log.dto';

export interface IActivityLogService {
  getListOffset(
    userId: string,
    pagination: IPaginationQueryOffsetParams,
  ): Promise<IResponsePagingReturn<ActivityLogDto>>;
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams,
  ): Promise<IResponsePagingReturn<ActivityLogDto>>;
}
