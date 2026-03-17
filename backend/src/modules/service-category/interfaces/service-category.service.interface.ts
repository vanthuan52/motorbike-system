import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryDoc } from '../entities/service-category.entity';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';

export interface IServiceCategoryService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServiceCategoryDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServiceCategoryDoc[]; total?: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc>;

  findBySlug(slug: string): Promise<ServiceCategoryDoc>;

  create(
    payload: ServiceCategoryCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceCategoryDoc>;

  update(
    id: string,
    payload: ServiceCategoryUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: ServiceCategoryUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;
  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;
}
