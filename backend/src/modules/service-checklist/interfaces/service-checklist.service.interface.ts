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
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ServiceChecklistModel } from '../models/service-checklist.model';
import { Prisma } from '@/generated/prisma-client';

export interface IServiceChecklistService {
  existByName(name: string): Promise<boolean>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServiceChecklistModel>>;

  findOneById(id: string): Promise<ServiceChecklistModel>;

  findOne(find: Record<string, any>): Promise<ServiceChecklistModel | null>;

  create(
    payload: ServiceChecklistCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<{ id: string }>>;

  createMany(data: ServiceChecklistCreateRequestDto[]): Promise<number>;

  update(
    id: string,
    payload: ServiceChecklistUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<void>>;

  delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>>;
}
