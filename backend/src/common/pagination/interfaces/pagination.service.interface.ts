import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../enums/pagination.enum';
import { IPaginationOrder } from './pagination.interface';

export interface IPaginationService {
  offset(page: number, perPage: number): number;
  totalPage(totalData: number, perPage: number): number;
  page(page?: number): number;
  perPage(perPage?: number): number;
  order(
    orderByValue: string,
    orderDirectionValue: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    availableOrderBy: string[],
  ): IPaginationOrder;
  search(searchValue: string, availableSearch: string[]): Record<string, any>;
}
