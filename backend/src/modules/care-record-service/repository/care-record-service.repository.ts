import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordService, Prisma } from '@generated/prisma-client';

@Injectable()
export class CareRecordServiceRepository {
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
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareRecordService[]> {
    const mergedWhere: Prisma.CareRecordServiceWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordService.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareRecordServiceWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordService.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordServiceSelect,
    Prisma.CareRecordServiceWhereInput
  >): Promise<IPaginationOffsetReturn<CareRecordService>> {
    return this.paginationService.offset<CareRecordService>(
      this.databaseService.careRecordService,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecord: true,
          vehicleService: true,
          careRecordChecklists: true,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordServiceSelect,
    Prisma.CareRecordServiceWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordService>> {
    return this.paginationService.cursor<CareRecordService>(
      this.databaseService.careRecordService,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecord: true,
          vehicleService: true,
          careRecordChecklists: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareRecordService | null> {
    return this.databaseService.careRecordService.findUnique({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });
  }

  async findOne(
    where: Prisma.CareRecordServiceWhereInput
  ): Promise<CareRecordService | null> {
    return this.databaseService.careRecordService.findFirst({
      where,
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });
  }

  async create(
    data: Prisma.CareRecordServiceCreateInput
  ): Promise<CareRecordService> {
    return this.databaseService.careRecordService.create({
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });
  }

  async createMany(
    data: Prisma.CareRecordServiceCreateInput[]
  ): Promise<{ count: number }> {
    return this.databaseService.careRecordService.createMany({
      data: data as any,
    });
  }

  async update(
    id: string,
    data: Prisma.CareRecordServiceUpdateInput
  ): Promise<CareRecordService> {
    return this.databaseService.careRecordService.update({
      where: { id },
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });
  }

  async delete(id: string): Promise<CareRecordService> {
    return this.databaseService.careRecordService.delete({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });
  }
}
