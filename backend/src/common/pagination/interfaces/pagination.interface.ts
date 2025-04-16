import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../pagination.enum';

export type IPaginationOrder = Record<
  string,
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE
>;

export interface IPaginationQueryOptions {
  defaultPerPage?: number;
  defaultOrderBy?: string;
  defaultOrderDirection?: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
  availableSearch?: string[];
  availableOrderBy?: string[];
}
