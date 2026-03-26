import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordMediaModel } from '../models/care-record-media.model';
import { Prisma } from '@generated/prisma-client';

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
  ): Promise<CareRecordMediaModel[]> {
    const mergedWhere: Prisma.CareRecordMediaWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
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
      deletedAt: null,
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
  >): Promise<IPaginationOffsetReturn<CareRecordMediaModel>> {
    return this.paginationService.offset<CareRecordMediaModel>(
      this.databaseService.careRecordMedia,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
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
  >): Promise<IPaginationCursorReturn<CareRecordMediaModel>> {
    return this.paginationService.cursor<CareRecordMediaModel>(
      this.databaseService.careRecordMedia,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
        },
        include: {
          careRecord: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareRecordMediaModel | null> {
    return this.databaseService.careRecordMedia.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        careRecord: true,
      },
    });
  }

  async findOne(
    where: Prisma.CareRecordMediaWhereInput
  ): Promise<CareRecordMediaModel | null> {
    return this.databaseService.careRecordMedia.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        careRecord: true,
      },
    });
  }

  async create(
    data: Prisma.CareRecordMediaCreateInput
  ): Promise<CareRecordMediaModel> {
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
  ): Promise<CareRecordMediaModel> {
    return this.databaseService.careRecordMedia.update({
      where: { id },
      data,
      include: {
        careRecord: true,
      },
    });
  }

  async delete(id: string): Promise<CareRecordMediaModel> {
    return this.databaseService.careRecordMedia.delete({
      where: { id },
      include: {
        careRecord: true,
      },
    });
  }
}
