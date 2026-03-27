import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecord as PrismaCareRecord,
  Prisma,
} from '@/generated/prisma-client';
import { CareRecordModel } from '../models/care-record.model';
import { CareRecordMapper } from '../mappers/care-record.mapper';

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
  ): Promise<CareRecordModel[]> {
    const mergedWhere: Prisma.CareRecordWhereInput = {
      ...baseWhere,
      ...filters,
    };

    const results = await this.databaseService.careRecord.findMany({
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

    return results.map(item => CareRecordMapper.toDomain(item));
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
  >): Promise<IPaginationOffsetReturn<CareRecordModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaCareRecord>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareRecordMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordSelect,
    Prisma.CareRecordWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaCareRecord>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareRecordMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<CareRecordModel | null> {
    const result = await this.databaseService.careRecord.findUnique({
      where: { id },
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });

    return result ? CareRecordMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareRecordWhereInput
  ): Promise<CareRecordModel | null> {
    const result = await this.databaseService.careRecord.findFirst({
      where,
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });

    return result ? CareRecordMapper.toDomain(result) : null;
  }

  async create(data: Prisma.CareRecordCreateInput): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.create({
      data,
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });

    return CareRecordMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareRecordUpdateInput
  ): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.update({
      where: { id },
      data,
      include: {
        appointment: true,
        technician: true,
        userVehicle: true,
        store: true,
      },
    });

    return CareRecordMapper.toDomain(result);
  }

  async delete(id: string): Promise<CareRecordModel> {
    const result = await this.databaseService.careRecord.delete({
      where: { id },
    });

    return CareRecordMapper.toDomain(result);
  }
}
