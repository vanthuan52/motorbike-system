import { Query } from '@nestjs/common';
import {
  IPaginationFilterDateBetweenOptions,
  IPaginationFilterEqualOptions,
  IPaginationFilterOptions,
  IPaginationQueryOptions,
} from '../interfaces/pagination.interface';
import { PaginationSearchPipe } from '../pipes/pagination.search.pipe';
import { PaginationPagingPipe } from '../pipes/pagination.paging.pipe';
import { PaginationOrderPipe } from '../pipes/pagination.order.pipe';
import { PaginationFilterInBooleanPipe } from '../pipes/pagination.filter-in-boolean.pipe';
import { PaginationFilterInEnumPipe } from '../pipes/pagination.filter-in-enum.pipe';
import { PaginationFilterStringContainPipe } from '../pipes/pagination.filter-string-contain.pipe';
import { PaginationFilterDateBetweenPipe } from '../pipes/pagination.filter-date-between.pipe';
import { PaginationFilterEqualPipe } from '../pipes/pagination.filter-equal.pipe';
import { PaginationFilterNotEqualPipe } from '../pipes/pagination.filter-not-equal.pipe';
import { PaginationFilterInPipe } from '../pipes/pagination.filter-in.pipe';

export function PaginationQuery(
  options?: IPaginationQueryOptions,
): ParameterDecorator {
  return Query(
    PaginationSearchPipe(options?.availableSearch),
    PaginationPagingPipe(options?.defaultPerPage),
    PaginationOrderPipe(
      options?.defaultOrderBy,
      options?.defaultOrderDirection,
      options?.availableOrderBy,
    ),
  );
}

export function PaginationQueryFilterInBoolean(
  field: string,
  defaultValue: boolean[],
  options?: IPaginationFilterOptions,
): ParameterDecorator {
  return Query(
    options?.queryField ?? field,
    PaginationFilterInBooleanPipe(field, defaultValue, options),
  );
}

export function PaginationQueryFilterInEnum<T>(
  field: string,
  defaultValue: T,
  defaultEnum: Record<string, any>,
  options?: IPaginationFilterOptions,
): ParameterDecorator {
  return Query(
    options?.queryField ?? field,
    PaginationFilterInEnumPipe<T>(field, defaultValue, defaultEnum, options),
  );
}

export function PaginationQueryFilterIn<T>(
  field: string,
  options?: IPaginationFilterOptions,
): ParameterDecorator {
  return Query(
    options?.queryField ?? field,
    PaginationFilterInPipe<T>(field, options),
  );
}

export function PaginationQueryFilterNotEqual(
  field: string,
  options?: IPaginationFilterEqualOptions,
): ParameterDecorator {
  return Query(
    options?.queryField ?? field,
    PaginationFilterNotEqualPipe(field, options),
  );
}

export function PaginationQueryFilterEqual(
  field: string,
  options?: IPaginationFilterEqualOptions,
): ParameterDecorator {
  return Query(
    options?.queryField ?? field,
    PaginationFilterEqualPipe(field, options),
  );
}

export function PaginationQueryFilterStringContain(
  field: string,
  options?: IPaginationFilterOptions,
): ParameterDecorator {
  return Query(
    options?.queryField ?? field,
    PaginationFilterStringContainPipe(field, options),
  );
}

export function PaginationQueryFilterDateBetween(
  fieldStart: string,
  fieldEnd: string,
  options?: IPaginationFilterDateBetweenOptions,
): ParameterDecorator {
  return Query(PaginationFilterDateBetweenPipe(fieldStart, fieldEnd, options));
}
