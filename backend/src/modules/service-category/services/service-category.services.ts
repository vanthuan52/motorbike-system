import { Injectable } from '@nestjs/common';
import { ServiceCategoryRepository } from '../repository/service-category.repository';
import { IServiceCategoryService } from '../interfaces/service-category.service.interface';
import {
  ServiceCategoryDoc,
  ServiceCategoryEntity,
} from '../entities/service-category.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';
import { ServiceCategoryGetResponseDto } from '../dtos/response/service-category.get.response.dto';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import { IServiceCategoryEntity } from '../interfaces/service-category.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServiceCategoryService implements IServiceCategoryService {
  constructor(
    private readonly serviceCategoryRepository: ServiceCategoryRepository,
  ) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const ServiceCategory = await this.serviceCategoryRepository.findOne(
      { name },
      options,
    );
    return !!ServiceCategory;
  }
  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const ServiceCategory = await this.serviceCategoryRepository.findOne(
      { slug },
      options,
    );
    return !!ServiceCategory;
  }
  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  mapList(
    ServiceCategory: ServiceCategoryDoc[] | IServiceCategoryEntity[],
  ): ServiceCategoryListResponseDto[] {
    return plainToInstance(
      ServiceCategoryListResponseDto,
      ServiceCategory.map((p: ServiceCategoryDoc | IServiceCategoryEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }
  mapGet(
    ServiceCategory: ServiceCategoryDoc | IServiceCategoryEntity,
  ): ServiceCategoryGetResponseDto {
    return plainToInstance(
      ServiceCategoryGetResponseDto,
      typeof (ServiceCategory as any).toObject === 'function'
        ? (ServiceCategory as any).toObject()
        : ServiceCategory,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServiceCategoryDoc[]> {
    return this.serviceCategoryRepository.findAll<ServiceCategoryDoc>(
      find,
      options,
    );
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServiceCategoryDoc[]> {
    return this.serviceCategoryRepository.findAll<ServiceCategoryDoc>(
      find,
      options,
    );
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc | null> {
    return this.serviceCategoryRepository.findOneById<ServiceCategoryDoc>(
      _id,
      options,
    );
  }
  async join(repository: ServiceCategoryDoc): Promise<ServiceCategoryDoc> {
    return this.serviceCategoryRepository.join(
      repository,
      this.serviceCategoryRepository._join!,
    );
  }
  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc | null> {
    return this.serviceCategoryRepository.findOne<ServiceCategoryDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.serviceCategoryRepository.getTotal(find, options);
  }

  async create(
    { name, slug, description, order }: ServiceCategoryCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceCategoryDoc> {
    const create: ServiceCategoryEntity = new ServiceCategoryEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.description = description;
    create.order = order;
    create.status = ENUM_SERVICE_CATEGORY_STATUS.ACTIVE;

    return this.serviceCategoryRepository.create<ServiceCategoryEntity>(
      create,
      options,
    );
  }

  async update(
    repository: ServiceCategoryDoc,
    { name, slug, description, order }: ServiceCategoryUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceCategoryDoc> {
    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description;
    repository.order = order;

    return this.serviceCategoryRepository.save(repository, options);
  }

  async softDelete(
    repository: ServiceCategoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceCategoryDoc> {
    return this.serviceCategoryRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.serviceCategoryRepository.deleteMany(find, options);
    return true;
  }
  async updateStatus(
    repository: ServiceCategoryDoc,
    { status }: ServiceCategoryUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceCategoryDoc> {
    repository.status = status;

    return this.serviceCategoryRepository.save(repository, options);
  }
  async findBySlug(slug: string): Promise<ServiceCategoryDoc | null> {
    return this.serviceCategoryRepository.findOneBySlug(slug);
  }
}
