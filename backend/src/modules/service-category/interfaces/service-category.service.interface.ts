import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

import { ServiceCategoryDoc } from '../entities/service-category.entity';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryGetResponseDto } from '../dtos/response/service-category.get.response.dto';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';

export interface IServiceCategoryService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServiceCategoryDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServiceCategoryDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<ServiceCategoryDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: ServiceCategoryCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceCategoryDoc>;

  update(
    repository: ServiceCategoryDoc,
    payload: ServiceCategoryUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceCategoryDoc>;

  softDelete(
    repository: ServiceCategoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceCategoryDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  createSlug(name: string): string;

  mapList(data: ServiceCategoryDoc[]): ServiceCategoryListResponseDto[];
  mapGet(data: ServiceCategoryDoc): ServiceCategoryGetResponseDto;
}
