import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordChecklist, Prisma } from '@generated/prisma-client';

@Injectable()
export class CareRecordChecklistRepository {
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
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareRecordChecklist[]> {
    const mergedWhere: Prisma.CareRecordChecklistWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordChecklist.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareRecordChecklistWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordChecklist.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordChecklistSelect,
    Prisma.CareRecordChecklistWhereInput
  >): Promise<IPaginationOffsetReturn<CareRecordChecklist>> {
    return this.paginationService.offset<CareRecordChecklist>(
      this.databaseService.careRecordChecklist,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecordService: true,
          serviceChecklist: true,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordChecklistSelect,
    Prisma.CareRecordChecklistWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordChecklist>> {
    return this.paginationService.cursor<CareRecordChecklist>(
      this.databaseService.careRecordChecklist,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecordService: true,
          serviceChecklist: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareRecordChecklist | null> {
    return this.databaseService.careRecordChecklist.findUnique({
      where: { id },
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });
  }

  async findOne(
    where: Prisma.CareRecordChecklistWhereInput
  ): Promise<CareRecordChecklist | null> {
    return this.databaseService.careRecordChecklist.findFirst({
      where,
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });
  }

  async create(
    data: Prisma.CareRecordChecklistCreateInput
  ): Promise<CareRecordChecklist> {
    return this.databaseService.careRecordChecklist.create({
      data,
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.CareRecordChecklistUpdateInput
  ): Promise<CareRecordChecklist> {
    return this.databaseService.careRecordChecklist.update({
      where: { id },
      data,
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });
  }

  async delete(id: string): Promise<CareRecordChecklist> {
    return this.databaseService.careRecordChecklist.delete({
      where: { id },
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });
  }

  async deleteMany(where: Prisma.CareRecordChecklistWhereInput): Promise<void> {
    await this.databaseService.careRecordChecklist.deleteMany({
      where,
    });
  }
}
