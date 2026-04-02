import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ServiceCategoryRepository } from '../repository/service-category.repository';
import { IServiceCategoryService } from '../interfaces/service-category.service.interface';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { EnumServiceCategoryStatus } from '../enums/service-category.enum';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IServiceCategoryListFilters } from '../interfaces/service-category.filter.interface';
import { EnumServiceCategoryStatusCodeError } from '../enums/service-category.status-code.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ServiceCategoryModel } from '../models/service-category.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServiceCategoryService implements IServiceCategoryService {
  constructor(
    private readonly serviceCategoryRepository: ServiceCategoryRepository
  ) {}

  async getListOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>> {
    const mergedWhere: Prisma.ServiceCategoryWhereInput = {
      ...where,
      ...filters,
    };

    return this.serviceCategoryRepository.findWithPaginationOffset({
      limit,
      skip,
      where: mergedWhere,
      orderBy,
    });
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationCursorReturn<ServiceCategoryModel>> {
    const mergedWhere: Prisma.ServiceCategoryWhereInput = {
      ...where,
      ...filters,
    };

    return this.serviceCategoryRepository.findWithPaginationCursor({
      limit,
      where: mergedWhere,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    });
  }

  async findOneById(id: string): Promise<ServiceCategoryModel> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById(id);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }
    return serviceCategory;
  }

  async findOne(
    find: Record<string, any>
  ): Promise<ServiceCategoryModel | null> {
    const serviceCategory = await this.serviceCategoryRepository.findOne(find);
    return serviceCategory;
  }

  async findBySlug(slug: string): Promise<ServiceCategoryModel> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneBySlug(slug);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }
    return serviceCategory;
  }

  async create(
    payload: ServiceCategoryCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<{ id: string }> {
    const { name, slug, description, orderBy } = payload;
    const existingSlug =
      await this.serviceCategoryRepository.findOneBySlug(slug);
    if (existingSlug) {
      throw new ConflictException({
        statusCode: EnumServiceCategoryStatusCodeError.slugExisted,
        message: 'service-category.error.slugExisted',
      });
    }

    const data: Prisma.ServiceCategoryCreateInput = {
      name,
      slug: slug.toLowerCase(),
      description: description ?? null,
      orderBy: orderBy ?? '0',
      status: EnumServiceCategoryStatus.active,
      createdBy: createdBy,
    };

    const created = await this.serviceCategoryRepository.create(data);

    return { id: created.id };
  }

  async update(
    id: string,
    payload: ServiceCategoryUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const { name, slug, description, orderBy } = payload;
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById(id);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }

    // Check slug conflict if slug is being updated
    if (slug && slug !== serviceCategory.slug) {
      const existingSlug =
        await this.serviceCategoryRepository.findOneBySlug(slug);
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException({
          statusCode: EnumServiceCategoryStatusCodeError.slugExisted,
          message: 'service-category.error.slugExisted',
        });
      }
    }

    const data: Prisma.ServiceCategoryUpdateInput = {
      name: name ?? undefined,
      slug: slug ? slug.toLowerCase() : undefined,
      description: description ?? undefined,
      orderBy: orderBy ?? undefined,
      updatedBy: updatedBy,
    };

    await this.serviceCategoryRepository.update(id, data);
  }

  async updateStatus(
    id: string,
    payload: ServiceCategoryUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const { status } = payload;
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById(id);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }

    await this.serviceCategoryRepository.update(id, {
      status,
      updatedBy: updatedBy,
    });
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById(id);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }

    await this.serviceCategoryRepository.update(id, {
      deletedAt: new Date(),
      deletedBy: deletedBy,
    });
  }

  async existByName(name: string): Promise<boolean> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      name,
    });
    return !!serviceCategory;
  }

  async existBySlug(slug: string): Promise<boolean> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneBySlug(slug);
    return !!serviceCategory;
  }
}
