import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordItem, Prisma } from '@generated/prisma-client';

@Injectable()
export class CareRecordItemRepository {
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
      Prisma.CareRecordItemSelect,
      Prisma.CareRecordItemWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareRecordItem[]> {
    const mergedWhere: Prisma.CareRecordItemWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordItem.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareRecordItemSelect,
      Prisma.CareRecordItemWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareRecordItemWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careRecordItem.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordItemSelect,
    Prisma.CareRecordItemWhereInput
  >): Promise<{
    data: CareRecordItem[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<CareRecordItem>(
      this.databaseService.careRecordItem,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecord: true,
          vehicleService: true,
          part: true,
          technician: true,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordItemSelect,
    Prisma.CareRecordItemWhereInput
  >): Promise<{
    data: CareRecordItem[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<CareRecordItem>(
      this.databaseService.careRecordItem,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careRecord: true,
          vehicleService: true,
          part: true,
          technician: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<CareRecordItem | null> {
    return this.databaseService.careRecordItem.findUnique({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async findOne(
    where: Prisma.CareRecordItemWhereInput
  ): Promise<CareRecordItem | null> {
    return this.databaseService.careRecordItem.findFirst({
      where,
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async create(data: Prisma.CareRecordItemCreateInput): Promise<CareRecordItem> {
    return this.databaseService.careRecordItem.create({
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.CareRecordItemUpdateInput
  ): Promise<CareRecordItem> {
    return this.databaseService.careRecordItem.update({
      where: { id },
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async delete(id: string): Promise<CareRecordItem> {
    return this.databaseService.careRecordItem.delete({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async save<T = CareRecordItem>(data: T): Promise<T> {
    const record = data as any;
    return this.databaseService.careRecordItem.update({
      where: { id: record.id },
      data: record,
    }) as Promise<T>;
  }

  async softDelete<T = CareRecordItem>(data: any): Promise<T> {
    return this.databaseService.careRecordItem.delete({
      where: { id: data.id },
    }) as Promise<T>;
  }
}
