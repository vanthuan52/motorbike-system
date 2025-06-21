import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IPaginationOrder } from '../interfaces/pagination.interface';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../enums/pagination.enum';

export class PaginationListDto {
  @ApiHideProperty()
  _search: Record<string, any>;

  @ApiHideProperty()
  _limit: number;

  @ApiHideProperty()
  _offset: number;

  @ApiHideProperty()
  _order: IPaginationOrder;

  @ApiHideProperty()
  _availableOrderBy: string[];

  @ApiHideProperty()
  _availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];

  @IsOptional()
  @ApiHideProperty()
  search?: Record<string, any>;

  @IsOptional()
  @ApiHideProperty()
  perPage?: number;

  @IsOptional()
  @ApiHideProperty()
  page?: number;

  @IsOptional()
  @ApiHideProperty()
  orderBy?: string;

  @IsOptional()
  @ApiHideProperty()
  orderDirection?: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
}
