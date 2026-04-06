import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  Prisma,
  CareRecordMedia as PrismaCareRecordMedia,
} from '@/generated/prisma-client';
import { CareRecordMediaModel } from '../models/care-record-media.model';
import { CareRecordMediaMapper } from '../mappers/care-record-media.mapper';
import { ICareRecordMediaListFilters } from '../interfaces/care-record-media.filter.interface';

const MEDIA_INCLUDE = {
  careRecord: true,
} as const;

@Injectable()
export class CareRecordMediaRepository {
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
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: ICareRecordMediaListFilters
  ): Promise<CareRecordMediaModel[]> {
    const mergedWhere: Prisma.CareRecordMediaWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.careRecordMedia.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: MEDIA_INCLUDE,
    });

    return results.map(item => CareRecordMediaMapper.toDomain(item));
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordMediaSelect,
    Prisma.CareRecordMediaWhereInput
  >): Promise<IPaginationOffsetReturn<CareRecordMediaModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaCareRecordMedia>(
        this.databaseService.careRecordMedia,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: MEDIA_INCLUDE,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordMediaMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordMediaSelect,
    Prisma.CareRecordMediaWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordMediaModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaCareRecordMedia>(
        this.databaseService.careRecordMedia,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: MEDIA_INCLUDE,
          includeCount: true,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordMediaMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<CareRecordMediaModel | null> {
    const result = await this.databaseService.careRecordMedia.findFirst({
      where: { id, deletedAt: null },
      include: MEDIA_INCLUDE,
    });
    return result ? CareRecordMediaMapper.toDomain(result) : null;
  }

  async findOneByIdIncludeDeleted(
    id: string
  ): Promise<CareRecordMediaModel | null> {
    const result = await this.databaseService.careRecordMedia.findUnique({
      where: { id },
      include: MEDIA_INCLUDE,
    });
    return result ? CareRecordMediaMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareRecordMediaWhereInput
  ): Promise<CareRecordMediaModel | null> {
    const result = await this.databaseService.careRecordMedia.findFirst({
      where: { ...where, deletedAt: null },
      include: MEDIA_INCLUDE,
    });
    return result ? CareRecordMediaMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.CareRecordMediaCreateInput
  ): Promise<CareRecordMediaModel> {
    const result = await this.databaseService.careRecordMedia.create({
      data,
      include: MEDIA_INCLUDE,
    });
    return CareRecordMediaMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareRecordMediaUpdateInput
  ): Promise<CareRecordMediaModel> {
    const result = await this.databaseService.careRecordMedia.update({
      where: { id },
      data,
      include: MEDIA_INCLUDE,
    });
    return CareRecordMediaMapper.toDomain(result);
  }

  async softDelete(
    id: string,
    deletedBy: string
  ): Promise<CareRecordMediaModel> {
    const result = await this.databaseService.careRecordMedia.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
      include: MEDIA_INCLUDE,
    });
    return CareRecordMediaMapper.toDomain(result);
  }

  async forceDelete(id: string): Promise<CareRecordMediaModel> {
    const result = await this.databaseService.careRecordMedia.delete({
      where: { id },
      include: MEDIA_INCLUDE,
    });
    return CareRecordMediaMapper.toDomain(result);
  }

  async deleteMany(
    where: Prisma.CareRecordMediaWhereInput = {}
  ): Promise<{ count: number }> {
    return this.databaseService.careRecordMedia.deleteMany({ where });
  }
}
