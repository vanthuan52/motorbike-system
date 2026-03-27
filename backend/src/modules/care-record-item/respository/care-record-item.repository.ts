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
import { CareRecordItemMapper } from '../mappers/care-record-item.mapper';
import {
  CareRecordItem as PrismaCareRecordItem,
  Prisma,
} from '@/generated/prisma-client';

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

    const results = await this.databaseService.careRecordItem.findMany({
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

    return results.map((item: PrismaCareRecordItem) =>
      CareRecordItemMapper.toDomain(item)
    );
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
    const paginatedResult =
      await this.paginationService.offset<PrismaCareRecordItem>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordItemMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordItemSelect,
    Prisma.CareRecordItemWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordItemModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaCareRecordItem>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordItemMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<CareRecordItemModel | null> {
    const result = await this.databaseService.careRecordItem.findFirst({
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

    return result ? CareRecordItemMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareRecordItemWhereInput
  ): Promise<CareRecordItemModel | null> {
    const result = await this.databaseService.careRecordItem.findFirst({
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

    return result ? CareRecordItemMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.CareRecordItemCreateInput
  ): Promise<CareRecordItemModel> {
    const result = await this.databaseService.careRecordItem.create({
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });

    return CareRecordItemMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareRecordItemUpdateInput
  ): Promise<CareRecordItemModel> {
    const result = await this.databaseService.careRecordItem.update({
      where: { id },
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });

    return CareRecordItemMapper.toDomain(result);
  }

  async delete(id: string): Promise<CareRecordItemModel> {
    const result = await this.databaseService.careRecordItem.delete({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        part: true,
        technician: true,
      },
    });

    return CareRecordItemMapper.toDomain(result);
  }

  async save(data: CareRecordItemModel): Promise<CareRecordItemModel> {
    const result = await this.databaseService.careRecordItem.update({
      where: { id: data.id },
      data: data as any,
    });

    return CareRecordItemMapper.toDomain(result);
  }

  async softDelete(data: any): Promise<CareRecordItemModel> {
    const result = await this.databaseService.careRecordItem.delete({
      where: { id: data.id },
    });

    return CareRecordItemMapper.toDomain(result);
  }
}
