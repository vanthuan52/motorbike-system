import { Prisma, ServiceCategory } from '@/generated/prisma-client';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';

export interface IServiceCategoryService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: ServiceCategory[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: ServiceCategory[]; total?: number }>;

  findOneById(id: string): Promise<ServiceCategory>;

  findOne(find: Record<string, any>): Promise<ServiceCategory | null>;

  findBySlug(slug: string): Promise<ServiceCategory | null>;

  create(payload: ServiceCategoryCreateRequestDto): Promise<{ id: string }>;

  update(id: string, payload: ServiceCategoryUpdateRequestDto): Promise<void>;

  updateStatus(
    id: string,
    payload: ServiceCategoryUpdateStatusRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  existByName(name: string): Promise<boolean>;

  existBySlug(slug: string): Promise<boolean>;
}
