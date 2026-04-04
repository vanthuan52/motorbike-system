import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ServiceChecklistModel } from '../models/service-checklist.model';
import { Prisma } from '@/generated/prisma-client';
import { IServiceChecklistListFilters } from './service-checklist.filter.interface';

export interface IServiceChecklistService {
  existByName(name: string): Promise<boolean>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationCursorReturn<ServiceChecklistModel>>;

  findOneById(id: string): Promise<ServiceChecklistModel>;

  findOne(find: Record<string, any>): Promise<ServiceChecklistModel | null>;

  create(
    payload: ServiceChecklistCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<ServiceChecklistModel>;

  createMany(data: ServiceChecklistCreateRequestDto[]): Promise<number>;

  update(
    id: string,
    payload: ServiceChecklistUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<ServiceChecklistModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceChecklistModel>;
}
