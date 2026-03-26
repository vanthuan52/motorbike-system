import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordItemModel } from '../models/care-record-item.model';
import { Prisma } from '@/generated/prisma-client';

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
  ): Promise<CareRecordItemModel[]> {
    const mergedWhere: Prisma.CareRecordItemWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
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
      deletedAt: null,
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
  >): Promise<IPaginationOffsetReturn<CareRecordItemModel>> {
    return this.paginationService.offset<CareRecordItemModel>(
      this.databaseService.careRecordItem,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
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
  >): Promise<IPaginationCursorReturn<CareRecordItemModel>> {
    return this.paginationService.cursor<CareRecordItemModel>(
      this.databaseService.careRecordItem,
      {
        ...params,
        where: {
          ...where,
          deletedAt: null,
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

  async findOneById(id: string): Promise<CareRecordItemModel | null> {
    return this.databaseService.CareRecordItemModel.findFirst({
      where: {
        id,
        deletedAt: null,
      },
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
  ): Promise<CareRecordItemModel | null> {
    return this.databaseService.CareRecordItemModel.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async create(
    data: Prisma.CareRecordItemCreateInput
  ): Promise<CareRecordItemModel> {
    return this.databaseService.CareRecordItemModel.create({
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
  ): Promise<CareRecordItemModel> {
    return this.databaseService.CareRecordItemModel.update({
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

  async delete(id: string): Promise<CareRecordItemModel> {
    return this.databaseService.CareRecordItemModel.delete({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });
  }

  async save<T = CareRecordItemModel>(data: T): Promise<T> {
    const record = data as any;
    return this.databaseService.careRecordItem.update({
      where: { id: record.id },
      data: record,
    }) as Promise<T>;
  }

  async softDelete<T = CareRecordItemModel>(data: any): Promise<T> {
    return this.databaseService.careRecordItem.delete({
      where: { id: data.id },
    }) as Promise<T>;
  }
}
