import { Prisma, ServiceCategory } from '@/generated/prisma-client';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

export interface IServiceCategoryService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<ServiceCategory>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<ServiceCategory>>;

  findOneById(id: string): Promise<ServiceCategory>;

  findOne(find: Record<string, any>): Promise<ServiceCategory | null>;

  findBySlug(slug: string): Promise<ServiceCategory | null>;

  create(
    payload: ServiceCategoryCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<{ id: string }>;
 
  update(
    id: string,
    payload: ServiceCategoryUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;
 
  updateStatus(
    id: string,
    payload: ServiceCategoryUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;
 
  delete(id: string, requestLog: IRequestLog, deletedBy: string): Promise<void>;

  existByName(name: string): Promise<boolean>;

  existBySlug(slug: string): Promise<boolean>;
}
