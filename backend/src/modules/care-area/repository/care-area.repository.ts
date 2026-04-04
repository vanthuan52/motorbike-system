import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareAreaModel } from '../models/care-area.model';
import { CareAreaMapper } from '../mappers/care-area.mapper';
import { ICareAreaListFilters } from '../interfaces/care-area.filter.interface';
import { CareArea as PrismaCareArea, Prisma } from '@/generated/prisma-client';

@Injectable()
export class CareAreaRepository {
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
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<CareAreaModel[]> {
    const mergedWhere: Prisma.CareAreaWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.careArea.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      ...rest,
    });

    return results.map((item: PrismaCareArea) => CareAreaMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.CareAreaWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    return this.databaseService.careArea.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareAreaSelect,
    Prisma.CareAreaWhereInput
  >): Promise<IPaginationOffsetReturn<CareAreaModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaCareArea>(
      this.databaseService.careArea,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareAreaMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareAreaSelect,
    Prisma.CareAreaWhereInput
  >): Promise<IPaginationCursorReturn<CareAreaModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaCareArea>(
      this.databaseService.careArea,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
        },
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareAreaMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<CareAreaModel | null> {
    const result = await this.databaseService.careArea.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return result ? CareAreaMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareAreaWhereInput
  ): Promise<CareAreaModel | null> {
    const result = await this.databaseService.careArea.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });

    return result ? CareAreaMapper.toDomain(result) : null;
  }

  async create(data: Prisma.CareAreaCreateInput): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.create({
      data,
    });

    return CareAreaMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareAreaUpdateInput
  ): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.update({
      where: {
        id,
        deletedAt: null,
      },
      data,
    });

    return CareAreaMapper.toDomain(result);
  }

  /**
   * Soft delete: sets deletedAt and deletedBy instead of removing the record.
   */
  async softDelete(id: string, deletedBy: string): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });

    return CareAreaMapper.toDomain(result);
  }

  /**
   * Restore a soft-deleted record by clearing deletedAt and deletedBy.
   */
  async restore(id: string, restoredBy: string): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
    });

    return CareAreaMapper.toDomain(result);
  }

  /**
   * Permanently remove a record from the database.
   * WARNING: This action is irreversible.
   */
  async forceDelete(id: string): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.delete({
      where: { id },
    });

    return CareAreaMapper.toDomain(result);
  }

  /**
   * Find a care area by ID regardless of soft-delete status.
   * Used for restore and trash detail operations.
   */
  async findOneByIdIncludeDeleted(id: string): Promise<CareAreaModel | null> {
    const result = await this.databaseService.careArea.findUnique({
      where: { id },
    });

    return result ? CareAreaMapper.toDomain(result) : null;
  }

  /**
   * Find trashed (soft-deleted) care areas with pagination.
   * Only returns records WHERE deletedAt IS NOT NULL.
   */
  async findWithPaginationOffsetTrashed({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareAreaSelect,
    Prisma.CareAreaWhereInput
  >): Promise<IPaginationOffsetReturn<CareAreaModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaCareArea>(
      this.databaseService.careArea,
      {
        ...params,
        where: {
          ...where,
          deletedAt: { not: null },
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareAreaMapper.toDomain(item)),
    };
  }
}
