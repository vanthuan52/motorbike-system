import { InfinityPaginationResponseDto } from '../../app/dtos/infinity-pagination-response.dto';
import { PaginationOption } from '../../app/types/pagination-option.type';

export const infinityPagination = <T>(
  data: T[],
  options: PaginationOption,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
