import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecord, Prisma } from '@/generated/prisma-client';

@Injectable()
export class CareRecordRepository {
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
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareRecord[]> {
    const mergedWhere: Prisma.CareRecordWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecord.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
      ...rest,
    });
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
  >): Promise<{
    data: CareRecord[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<CareRecord>(
      this.databaseService.careRecord,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          appointment: true,
          technician: true,
          userVehicle: true,
          store: true,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordSelect,
    Prisma.CareRecordWhereInput
  >): Promise<{
    data: CareRecord[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<CareRecord>(
      this.databaseService.careRecord,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          appointment: true,
          technician: true,
          userVehicle: true,
          store: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareRecord | null> {
    return this.databaseService.careRecord.findUnique({
      where: { id },
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });
  }

  async findOne(
    where: Prisma.CareRecordWhereInput
  ): Promise<CareRecord | null> {
    return this.databaseService.careRecord.findFirst({
      where,
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });
  }

  async create(data: Prisma.CareRecordCreateInput): Promise<CareRecord> {
    return this.databaseService.careRecord.create({
      data,
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.CareRecordUpdateInput
  ): Promise<CareRecord> {
    return this.databaseService.careRecord.update({
      where: { id },
      data,
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });
  }

  async delete(id: string): Promise<CareRecord> {
    return this.databaseService.careRecord.delete({
      where: { id },
    });
  }
}
