import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { ServiceCategoryModel } from '../models/service-category.model';
import { ServiceCategoryMapper } from '../mappers/service-category.mapper';
import {
  ServiceCategory as PrismaServiceCategory,
  Prisma,
} from '@/generated/prisma-client';
import { IServiceCategoryListFilters } from '../interfaces/service-category.filter.interface';

@Injectable()
export class ServiceCategoryRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findAll(
    {
      where: baseWhere,
      skip,
      limit,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<ServiceCategoryModel[]> {
    const mergedWhere: Prisma.ServiceCategoryWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.serviceCategory.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
    });

    return results.map((item: PrismaServiceCategory) =>
      ServiceCategoryMapper.toDomain(item)
    );
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.ServiceCategorySelect,
    Prisma.ServiceCategoryWhereInput
  >,
  filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaServiceCategory,
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >(this.databaseService.serviceCategory, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ServiceCategoryMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.ServiceCategorySelect,
    Prisma.ServiceCategoryWhereInput
  >): Promise<IPaginationCursorReturn<ServiceCategoryModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaServiceCategory,
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >(this.databaseService.serviceCategory, {
      ...params,
      where: {
        ...where,
        deletedAt: null,
      },
      includeCount: true,
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ServiceCategoryMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationOffsetTrashed({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.ServiceCategorySelect,
    Prisma.ServiceCategoryWhereInput
  >,
  filters?: IServiceCategoryListFilters
  ): Promise<IPaginationOffsetReturn<ServiceCategoryModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaServiceCategory,
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >(this.databaseService.serviceCategory, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: { not: null },
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ServiceCategoryMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findFirst({
      where: { id, deletedAt: null },
    });
    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async findOneByIdIncludeDeleted(
    id: string
  ): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findUnique({
      where: { id },
    });
    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findFirst({
      where: { slug, deletedAt: null },
    });
    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.ServiceCategoryWhereInput
  ): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findFirst({
      where: { ...where, deletedAt: null },
    });
    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.ServiceCategoryCreateInput
  ): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.create({ data });
    return ServiceCategoryMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.ServiceCategoryUpdateInput
  ): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.update({
      where: { id },
      data,
    });
    return ServiceCategoryMapper.toDomain(result);
  }

  async softDelete(
    id: string,
    deletedBy: string
  ): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
    return ServiceCategoryMapper.toDomain(result);
  }

  async restore(
    id: string,
    restoredBy: string
  ): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
    });
    return ServiceCategoryMapper.toDomain(result);
  }

  async forceDelete(id: string): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.delete({
      where: { id },
    });
    return ServiceCategoryMapper.toDomain(result);
  }

  async deleteMany(
    where: Prisma.ServiceCategoryWhereInput = {}
  ): Promise<{ count: number }> {
    return this.databaseService.serviceCategory.deleteMany({ where });
  }
}
