import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareArea, Prisma } from '@/generated/prisma-client';

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
    filters?: Record<string, any>
  ): Promise<CareArea[]> {
    const mergedWhere: Prisma.CareAreaWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careArea.findMany({
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
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareAreaWhereInput = {
      ...baseWhere,
      ...filters,
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
  >): Promise<IPaginationOffsetReturn<CareArea>> {
    return this.paginationService.offset<CareArea>(
      this.databaseService.careArea,
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
    Prisma.CareAreaSelect,
    Prisma.CareAreaWhereInput
  >): Promise<IPaginationCursorReturn<CareArea>> {
    return this.paginationService.cursor<CareArea>(
      this.databaseService.careArea,
      {
        ...params,
        where: {
          ...where,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareArea | null> {
    return this.databaseService.careArea.findUnique({
      where: { id },
    });
  }

  async findOne(where: Prisma.CareAreaWhereInput): Promise<CareArea | null> {
    return this.databaseService.careArea.findFirst({
      where,
    });
  }

  async create(data: Prisma.CareAreaCreateInput): Promise<CareArea> {
    return this.databaseService.careArea.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.CareAreaUpdateInput
  ): Promise<CareArea> {
    return this.databaseService.careArea.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<CareArea> {
    return this.databaseService.careArea.delete({
      where: { id },
    });
  }
}
