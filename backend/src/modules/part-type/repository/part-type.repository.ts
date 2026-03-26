import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { PartType, Prisma } from '@/generated/prisma-client';

@Injectable()
export class PartTypeRepository {
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
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<PartType[]> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.partType.findMany({
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
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.partType.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.PartTypeSelect,
    Prisma.PartTypeWhereInput
  >): Promise<IPaginationOffsetReturn<PartType>> {
    return this.paginationService.offset<PartType>(
      this.databaseService.partType,
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
    Prisma.PartTypeSelect,
    Prisma.PartTypeWhereInput
  >): Promise<IPaginationCursorReturn<PartType>> {
    return this.paginationService.cursor<PartType>(
      this.databaseService.partType,
      {
        ...params,
        where: {
          ...where,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<PartType | null> {
    return this.databaseService.partType.findUnique({
      where: { id },
    });
  }

  async findOneBySlug(slug: string): Promise<PartType | null> {
    return this.databaseService.partType.findFirst({
      where: { slug },
    });
  }

  async findOne(where: Prisma.PartTypeWhereInput): Promise<PartType | null> {
    return this.databaseService.partType.findFirst({
      where,
    });
  }

  async create(data: Prisma.PartTypeCreateInput): Promise<PartType> {
    return this.databaseService.partType.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.PartTypeUpdateInput
  ): Promise<PartType> {
    return this.databaseService.partType.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<PartType> {
    return this.databaseService.partType.delete({
      where: { id },
    });
  }
}
