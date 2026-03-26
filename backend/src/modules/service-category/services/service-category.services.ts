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
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumServiceCategoryStatusCodeError } from '../enums/service-category.status-code.enum';
import { ServiceCategory, Prisma } from '@/generated/prisma-client';

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
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<ServiceCategory>> {
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
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<ServiceCategory>> {
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

  async findOneById(id: string): Promise<ServiceCategory> {
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

  async findOne(find: Record<string, any>): Promise<ServiceCategory | null> {
    const serviceCategory = await this.serviceCategoryRepository.findOne(find);
    return serviceCategory;
  }

  async findBySlug(slug: string): Promise<ServiceCategory> {
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

  async create({
    name,
    slug,
    description,
    orderBy,
  }: ServiceCategoryCreateRequestDto): Promise<{ id: string }> {
    // Check slug conflict
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
    };

    const created = await this.serviceCategoryRepository.create(data);

    return { id: created.id };
  }

  async update(
    id: string,
    { name, slug, description, orderBy }: ServiceCategoryUpdateRequestDto
  ): Promise<void> {
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
    };

    await this.serviceCategoryRepository.update(id, data);
  }

  async updateStatus(
    id: string,
    { status }: ServiceCategoryUpdateStatusRequestDto
  ): Promise<void> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById(id);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }

    await this.serviceCategoryRepository.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    const serviceCategory =
      await this.serviceCategoryRepository.findOneById(id);
    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }

    await this.serviceCategoryRepository.delete(id);
  }

  async existByName(name: string): Promise<boolean> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      name,
    });
    return !!serviceCategory;
  }

  async existBySlug(slug: string): Promise<boolean> {
    const serviceCategory = await this.serviceCategoryRepository.findOneBySlug(
      slug
    );
    return !!serviceCategory;
  }
}
