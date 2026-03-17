import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR } from '../enums/service-category.status-code.enum';

@Injectable()
export class ServiceCategoryService implements IServiceCategoryService {
  constructor(
    private readonly serviceCategoryRepository: ServiceCategoryRepository,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServiceCategoryDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [serviceCategories, total] = await Promise.all([
      this.serviceCategoryRepository.findAll<ServiceCategoryDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.serviceCategoryRepository.getTotal(find),
    ]);

    return {
      data: serviceCategories,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServiceCategoryDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.serviceCategoryRepository.findAllCursor<ServiceCategoryDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.serviceCategoryRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total: count };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc> {
    const serviceCategory = await this.findOneByIdOrFail(id, options);
    return serviceCategory;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOne<ServiceCategoryDoc>(
        find,
        options,
      );
    if (!serviceCategory) {
      return null as any;
    }
    return serviceCategory;
  }

  async findBySlug(slug: string): Promise<ServiceCategoryDoc> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneBySlug(slug);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-category.error.notFound',
      });
    }
    return serviceCategory;
  }

  async create(
    { name, slug, description, order }: ServiceCategoryCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceCategoryDoc> {
    // Check slug conflict
    const existingSlug =
      await this.serviceCategoryRepository.findOneBySlug(slug);
    if (existingSlug) {
      throw new ConflictException({
        statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'service-category.error.slugExisted',
      });
    }

    const create: ServiceCategoryEntity = new ServiceCategoryEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.description = description;
    create.order = order;
    create.status = ENUM_SERVICE_CATEGORY_STATUS.ACTIVE;

    const created =
      await this.serviceCategoryRepository.create<ServiceCategoryEntity>(
        create,
        options,
      );

    return created;
  }

  async update(
    id: string,
    { name, slug, description, order }: ServiceCategoryUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    // Check slug conflict if slug is being updated
    if (slug && slug !== repository.slug) {
      const existingSlug =
        await this.serviceCategoryRepository.findOneBySlug(slug);
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ConflictException({
          statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'service-category.error.slugExisted',
        });
      }
    }

    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description;
    repository.order = order;

    await this.serviceCategoryRepository.save(repository, options);
  }

  async updateStatus(
    id: string,
    { status }: ServiceCategoryUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.serviceCategoryRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.serviceCategoryRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.serviceCategoryRepository.deleteMany(find, options);
    return true;
  }

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const exist = await this.serviceCategoryRepository.exists(
      { name },
      options,
    );
    return exist;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const exist = await this.serviceCategoryRepository.exists(
      { slug },
      options,
    );
    return exist;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceCategoryDoc> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById<ServiceCategoryDoc>(
        id,
        options,
      );
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-category.error.notFound',
      });
    }
    return serviceCategory;
  }
}
