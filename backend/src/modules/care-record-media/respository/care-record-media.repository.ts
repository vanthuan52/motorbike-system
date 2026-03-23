import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordMedia, Prisma } from '@generated/prisma-client';

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
      ...rest
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareRecordMedia[]> {
    const mergedWhere: Prisma.CareRecordMediaWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordMedia.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        careRecord: true,
      },
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareRecordMediaWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordMedia.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordMediaSelect,
    Prisma.CareRecordMediaWhereInput
  >): Promise<{
    data: CareRecordMedia[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<CareRecordMedia>(
      this.databaseService.careRecordMedia,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecord: true,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordMediaSelect,
    Prisma.CareRecordMediaWhereInput
  >): Promise<{
    data: CareRecordMedia[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<CareRecordMedia>(
      this.databaseService.careRecordMedia,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecord: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareRecordMedia | null> {
    return this.databaseService.careRecordMedia.findUnique({
      where: { id },
      include: {
        careRecord: true,
      },
    });
  }

  async findOne(
    where: Prisma.CareRecordMediaWhereInput
  ): Promise<CareRecordMedia | null> {
    return this.databaseService.careRecordMedia.findFirst({
      where,
      include: {
        careRecord: true,
      },
    });
  }

  async create(data: Prisma.CareRecordMediaCreateInput): Promise<CareRecordMedia> {
    return this.databaseService.careRecordMedia.create({
      data,
      include: {
        careRecord: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.CareRecordMediaUpdateInput
  ): Promise<CareRecordMedia> {
    return this.databaseService.careRecordMedia.update({
      where: { id },
      data,
      include: {
        careRecord: true,
      },
    });
  }

  async delete(id: string): Promise<CareRecordMedia> {
    return this.databaseService.careRecordMedia.delete({
      where: { id },
      include: {
        careRecord: true,
      },
    });
  }
}
