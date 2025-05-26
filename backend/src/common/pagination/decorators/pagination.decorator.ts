import { Query } from '@nestjs/common';
import { IPaginationQueryOptions } from '../interfaces/pagination.interface';

export function PaginationQuery(
  options?: IPaginationQueryOptions,
): ParameterDecorator {
  return Query();
}
