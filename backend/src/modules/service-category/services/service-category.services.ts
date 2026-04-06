import {
  BadRequestException,
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
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>> {
    const { data, ...others } =
      await this.serviceCategoryRepository.findWithPaginationOffset(
        pagination,
        filters
      );
    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationCursorReturn<ServiceCategoryModel>> {
    const { data, ...others } =
      await this.serviceCategoryRepository.findWithPaginationCursor(pagination);
    return { data, ...others };
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
    return this.serviceCategoryRepository.findOne(find);
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
  ): Promise<ServiceCategoryModel> {
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
      orderBy: orderBy ?? 0,
      status: EnumServiceCategoryStatus.active,
      createdBy,
    };

    return this.serviceCategoryRepository.create(data);
  }

  async update(
    id: string,
    payload: ServiceCategoryUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<ServiceCategoryModel> {
    const { name, slug, description, orderBy } = payload;
    const serviceCategory = await this.findOneById(id);

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
      updatedBy,
    };

    return this.serviceCategoryRepository.update(id, data);
  }

  async updateStatus(
    id: string,
    payload: ServiceCategoryUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<ServiceCategoryModel> {
    await this.findOneById(id);
    return this.serviceCategoryRepository.update(id, {
      status: payload.status,
      updatedBy,
    });
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceCategoryModel> {
    await this.findOneById(id);
    return this.serviceCategoryRepository.softDelete(id, deletedBy);
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

  // === Trash/Restore ===

  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>> {
    const { data, ...others } =
      await this.serviceCategoryRepository.findWithPaginationOffsetTrashed(
        pagination,
        filters
      );
    return { data, ...others };
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<ServiceCategoryModel> {
    const category =
      await this.serviceCategoryRepository.findOneByIdIncludeDeleted(id);
    if (!category) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }
    if (!category.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumServiceCategoryStatusCodeError.notInTrash,
        message: 'service-category.error.notInTrash',
      });
    }
    return this.serviceCategoryRepository.restore(id, restoredBy);
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceCategoryModel> {
    const category =
      await this.serviceCategoryRepository.findOneByIdIncludeDeleted(id);
    if (!category) {
      throw new NotFoundException({
        statusCode: EnumServiceCategoryStatusCodeError.notFound,
        message: 'service-category.error.notFound',
      });
    }
    if (!category.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumServiceCategoryStatusCodeError.notInTrash,
        message: 'service-category.error.notInTrash',
      });
    }
    return this.serviceCategoryRepository.forceDelete(id);
  }
}
