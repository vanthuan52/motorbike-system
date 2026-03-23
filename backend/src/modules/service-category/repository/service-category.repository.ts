import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { ServiceCategory, Prisma } from '@/generated/prisma-client';

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
    filters?: Record<string, any>
  ): Promise<ServiceCategory[]> {
    const mergedWhere: Prisma.ServiceCategoryWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.serviceCategory.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    filters?: Record<string, any>
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
  >): Promise<{
    data: ServiceCategory[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<ServiceCategory>(
      this.databaseService.serviceCategory,
      {
        ...params,
        where: {
          ...where,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.ServiceCategorySelect,
    Prisma.ServiceCategoryWhereInput
  >): Promise<{
    data: ServiceCategory[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<ServiceCategory>(
      this.databaseService.serviceCategory,
      {
        ...params,
        where: {
          ...where,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<ServiceCategory | null> {
    return this.databaseService.serviceCategory.findUnique({
      where: { id },
    });
  }

  async findOneBySlug(slug: string): Promise<ServiceCategory | null> {
    return this.databaseService.serviceCategory.findFirst({
      where: { slug },
    });
  }

  async findOne(
    where: Prisma.ServiceCategoryWhereInput
  ): Promise<ServiceCategory | null> {
    return this.databaseService.serviceCategory.findFirst({
      where,
    });
  }

  async create(data: Prisma.ServiceCategoryCreateInput): Promise<ServiceCategory> {
    return this.databaseService.serviceCategory.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ServiceCategoryUpdateInput
  ): Promise<ServiceCategory> {
    return this.databaseService.serviceCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ServiceCategory> {
    return this.databaseService.serviceCategory.delete({
      where: { id },
    });
  }
}
