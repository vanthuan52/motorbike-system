import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecord as PrismaCareRecord,
  Prisma,
} from '@/generated/prisma-client';
import { CareRecordModel } from '../models/care-record.model';
import { CareRecordMapper } from '../mappers/care-record.mapper';

@Injectable()
export class CareRecordRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  private readonly standardInclude = {
    appointment: true,
    technician: true,
    userVehicle: true,
    store: true,
    careArea: true,
  };

  async findAll(
    {
      where: baseWhere,
      skip,
      limit,
      orderBy,
      ...rest
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareRecordModel[]> {
    const mergedWhere: Prisma.CareRecordWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.careRecord.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: this.standardInclude,
      ...rest,
    });

    return results.map(item => CareRecordMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareRecordWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    return this.databaseService.careRecord.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordSelect,
    Prisma.CareRecordWhereInput
  >): Promise<IPaginationOffsetReturn<CareRecordModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaCareRecord>(
      this.databaseService.careRecord,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
        },
        include: this.standardInclude,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareRecordMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordSelect,
    Prisma.CareRecordWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaCareRecord>(
      this.databaseService.careRecord,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
        },
        include: this.standardInclude,
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareRecordMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<CareRecordModel | null> {
    const result = await this.databaseService.careRecord.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: this.standardInclude,
    });

    return result ? CareRecordMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareRecordWhereInput
  ): Promise<CareRecordModel | null> {
    const result = await this.databaseService.careRecord.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: this.standardInclude,
    });

    return result ? CareRecordMapper.toDomain(result) : null;
  }

  async create(data: Prisma.CareRecordCreateInput): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.create({
      data,
      include: this.standardInclude,
    });

    return CareRecordMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareRecordUpdateInput
  ): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.update({
      where: {
        id,
        deletedAt: null,
      },
      data,
      include: this.standardInclude,
    });

    return CareRecordMapper.toDomain(result);
  }

  /**
   * Soft delete: sets deletedAt and deletedBy instead of removing the record.
   */
  async softDelete(id: string, deletedBy: string): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
      include: this.standardInclude,
    });

    return CareRecordMapper.toDomain(result);
  }

  /**
   * Restore a soft-deleted record by clearing deletedAt and deletedBy.
   */
  async restore(id: string, restoredBy: string): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
      include: this.standardInclude,
    });

    return CareRecordMapper.toDomain(result);
  }

  /**
   * Permanently remove a record from the database.
   * WARNING: This action is irreversible.
   */
  async forceDelete(id: string): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.delete({
      where: { id },
    });

    return CareRecordMapper.toDomain(result);
  }

  /**
   * Find a care record by ID regardless of soft-delete status.
   * Used for restore and trash detail operations.
   */
  async findOneByIdIncludeDeleted(id: string): Promise<CareRecordModel | null> {
    const result = await this.databaseService.careRecord.findUnique({
      where: { id },
      include: this.standardInclude,
    });

    return result ? CareRecordMapper.toDomain(result) : null;
  }

  /**
   * Find trashed (soft-deleted) care records with pagination.
   * Only returns records WHERE deletedAt IS NOT NULL.
   */
  async findWithPaginationOffsetTrashed({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordSelect,
    Prisma.CareRecordWhereInput
  >): Promise<IPaginationOffsetReturn<CareRecordModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaCareRecord>(
      this.databaseService.careRecord,
      {
        ...params,
        where: {
          ...where,
          deletedAt: { not: null },
        },
        include: this.standardInclude,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareRecordMapper.toDomain(item)),
    };
  }
}
