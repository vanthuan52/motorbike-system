import { Prisma, ServicePrice } from '@/generated/prisma-client';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';

export interface IServicePriceService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: ServicePrice[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: ServicePrice[]; total?: number }>;

  findOneById(id: string): Promise<ServicePrice>;

  findOne(find: Record<string, any>): Promise<ServicePrice | null>;

  create(payload: ServicePriceCreateRequestDto): Promise<{ id: string }>;

  update(
    id: string,
    payload: ServicePriceUpdateRequestDto,
  ): Promise<void>;

  delete(id: string): Promise<void>;
}
