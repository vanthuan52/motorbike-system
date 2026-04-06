import { Prisma } from '@/generated/prisma-client';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IServiceCategoryListFilters } from './service-category.filter.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ServiceCategoryModel } from '../models/service-category.model';

export interface IServiceCategoryService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationCursorReturn<ServiceCategoryModel>>;

  findOneById(id: string): Promise<ServiceCategoryModel>;

  findOne(find: Record<string, any>): Promise<ServiceCategoryModel | null>;

  findBySlug(slug: string): Promise<ServiceCategoryModel>;

  create(
    payload: ServiceCategoryCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<ServiceCategoryModel>;

  update(
    id: string,
    payload: ServiceCategoryUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<ServiceCategoryModel>;

  updateStatus(
    id: string,
    payload: ServiceCategoryUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<ServiceCategoryModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceCategoryModel>;

  existByName(name: string): Promise<boolean>;

  existBySlug(slug: string): Promise<boolean>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>>;

  restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<ServiceCategoryModel>;

  forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceCategoryModel>;
}
