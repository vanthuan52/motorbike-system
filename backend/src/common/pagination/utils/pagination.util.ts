import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { EnumPaginationType } from '../enums/pagination.enum';

@Injectable()
export class PaginationUtil {
  constructor() {}

  formatOffset<T>(
    data: T[],
    total: number,
    { limit, skip }: { limit: number; skip: number },
  ): IResponsePagingReturn<T> {
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
      data,
    };
  }

  formatCursor<T>(
    rawData: T[],
    total: number | undefined,
    { limit, cursorField }: { limit: number; cursorField?: string },
  ): IResponsePagingReturn<T> {
    // 1. Kiểm tra hasNext dựa trên việc fetch dư 1 record
    const hasNext = rawData.length > limit;

    // 2. Lấy đúng số lượng item yêu cầu
    const items = hasNext ? rawData.slice(0, limit) : rawData;

    // 3. Xác định cursor tiếp theo từ field cụ thể (vd: createdAt, id)
    const nextCursor =
      hasNext && items.length > 0 && cursorField
        ? String((items[items.length - 1] as any)[cursorField])
        : undefined;

    return {
      type: EnumPaginationType.cursor,
      count: total,
      perPage: limit,
      hasNext,
      cursor: nextCursor,
      data: items,
    };
  }
}
