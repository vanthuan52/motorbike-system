import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { Prisma, ServicePrice } from '@/generated/prisma-client';

export interface IServicePriceService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServicePrice>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServicePrice>>;

  findOneById(id: string): Promise<ServicePrice>;

  findOne(find: Record<string, any>): Promise<ServicePrice | null>;

  create(payload: ServicePriceCreateRequestDto): Promise<{ id: string }>;

  update(id: string, payload: ServicePriceUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<void>;
}
