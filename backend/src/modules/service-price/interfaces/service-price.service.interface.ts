import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { ServicePriceModel } from '../models/service-price.model';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { Prisma } from '@/generated/prisma-client';

export interface IServicePriceService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServicePriceModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServicePriceModel>>;

  findOneById(id: string): Promise<ServicePriceModel>;

  findOne(find: Record<string, any>): Promise<ServicePriceModel | null>;

  create(
    payload: ServicePriceCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<{ id: string }>>;

  update(
    id: string,
    payload: ServicePriceUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<void>>;

  delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>>;
}
