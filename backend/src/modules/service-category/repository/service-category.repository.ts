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
      ...rest
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<ServiceCategoryModel[]> {
    const mergedWhere: Prisma.ServiceCategoryWhereInput = {
      ...baseWhere,
      ...filters,
    };

    const results = await this.databaseService.serviceCategory.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      ...rest,
    });

    return results.map((item: PrismaServiceCategory) =>
      ServiceCategoryMapper.toDomain(item)
    );
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: IServiceCategoryListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.ServiceCategoryWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.serviceCategory.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.ServiceCategorySelect,
    Prisma.ServiceCategoryWhereInput
  >): Promise<IPaginationOffsetReturn<ServiceCategoryModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaServiceCategory,
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >(this.databaseService.serviceCategory, {
      ...params,
      where: {
        ...where,
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

  async findOneById(id: string): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findUnique({
      where: { id },
    });

    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findFirst({
      where: { slug },
    });

    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.ServiceCategoryWhereInput
  ): Promise<ServiceCategoryModel | null> {
    const result = await this.databaseService.serviceCategory.findFirst({
      where,
    });

    return result ? ServiceCategoryMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.ServiceCategoryCreateInput
  ): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.create({
      data,
    });

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

  async delete(id: string): Promise<ServiceCategoryModel> {
    const result = await this.databaseService.serviceCategory.delete({
      where: { id },
    });

    return ServiceCategoryMapper.toDomain(result);
  }
}
