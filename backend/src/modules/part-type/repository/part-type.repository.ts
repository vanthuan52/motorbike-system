import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IPartTypeListFilters } from '../interfaces/part-type.filter.interface';
import { PartTypeModel } from '../models/part-type.model';
import { PartTypeMapper } from '../mappers/part-type.mapper';
import { PartType as PrismaPartType, Prisma } from '@/generated/prisma-client';

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
    filters?: IPartTypeListFilters
  ): Promise<PartTypeModel[]> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.partType.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      ...rest,
    });

    return results.map((item: PrismaPartType) => PartTypeMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    return this.databaseService.partType.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationOffsetReturn<PartTypeModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaPartType>(
      this.databaseService.partType,
      {
        ...params,
        where: {
          ...where,
          ...filters,
          deletedAt: null,
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => PartTypeMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationCursorReturn<PartTypeModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaPartType>(
      this.databaseService.partType,
      {
        ...params,
        where: {
          ...where,
          ...filters,
          deletedAt: null,
        },
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => PartTypeMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<PartTypeModel | null> {
    const result = await this.databaseService.partType.findFirst({
      where: { id, deletedAt: null },
    });
    return result ? PartTypeMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<PartTypeModel | null> {
    const result = await this.databaseService.partType.findFirst({
      where: { slug, deletedAt: null },
    });
    return result ? PartTypeMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.PartTypeWhereInput
  ): Promise<PartTypeModel | null> {
    const result = await this.databaseService.partType.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });
    return result ? PartTypeMapper.toDomain(result) : null;
  }

  async create(data: Prisma.PartTypeCreateInput): Promise<PartTypeModel> {
    const result = await this.databaseService.partType.create({ data });
    return PartTypeMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.PartTypeUpdateInput
  ): Promise<PartTypeModel> {
    const result = await this.databaseService.partType.update({
      where: { id, deletedAt: null },
      data,
    });
    return PartTypeMapper.toDomain(result);
  }

  /**
   * Soft delete: sets deletedAt and deletedBy instead of removing the record.
   */
  async softDelete(id: string, deletedBy: string): Promise<PartTypeModel> {
    const result = await this.databaseService.partType.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
    return PartTypeMapper.toDomain(result);
  }

  /**
   * Restore a soft-deleted record by clearing deletedAt and deletedBy.
   */
  async restore(id: string, restoredBy: string): Promise<PartTypeModel> {
    const result = await this.databaseService.partType.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
    });
    return PartTypeMapper.toDomain(result);
  }

  /**
   * Permanently remove a record from the database.
   * WARNING: This action is irreversible.
   */
  async forceDelete(id: string): Promise<PartTypeModel> {
    const result = await this.databaseService.partType.delete({
      where: { id },
    });
    return PartTypeMapper.toDomain(result);
  }

  /**
   * Find a part type by ID regardless of soft-delete status.
   * Used for restore and trash detail operations.
   */
  async findOneByIdIncludeDeleted(id: string): Promise<PartTypeModel | null> {
    const result = await this.databaseService.partType.findUnique({
      where: { id },
    });
    return result ? PartTypeMapper.toDomain(result) : null;
  }

  /**
   * Find trashed (soft-deleted) part types with pagination.
   * Only returns records WHERE deletedAt IS NOT NULL.
   */
  async findWithPaginationOffsetTrashed(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationOffsetReturn<PartTypeModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaPartType>(
      this.databaseService.partType,
      {
        ...params,
        where: {
          ...where,
          ...filters,
          deletedAt: { not: null },
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => PartTypeMapper.toDomain(item)),
    };
  }

  async deleteMany(
    where: Prisma.PartTypeWhereInput = {}
  ): Promise<{ count: number }> {
    return this.databaseService.partType.deleteMany({ where });
  }
}
