import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordServiceModel } from '../models/care-record-service.model';
import { CareRecordServiceMapper } from '../mappers/care-record-service.mapper';
import {
  CareRecordService as PrismaCareRecordService,
  Prisma,
} from '@/generated/prisma-client';

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
  ): Promise<CareRecordServiceModel[]> {
    const mergedWhere: Prisma.CareRecordServiceWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.careRecordService.findMany({
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

    return results.map((item: PrismaCareRecordService) =>
      CareRecordServiceMapper.toDomain(item)
    );
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
      deletedAt: null,
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
  >): Promise<IPaginationOffsetReturn<CareRecordServiceModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaCareRecordService>(
        this.databaseService.careRecordService,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: {
            careRecord: true,
            vehicleService: true,
            careRecordChecklists: true,
          },
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordServiceMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordServiceSelect,
    Prisma.CareRecordServiceWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordServiceModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaCareRecordService>(
        this.databaseService.careRecordService,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: {
            careRecord: true,
            vehicleService: true,
            careRecordChecklists: true,
          },
          includeCount: true,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordServiceMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<CareRecordServiceModel | null> {
    const result = await this.databaseService.careRecordService.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });

    return result ? CareRecordServiceMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareRecordServiceWhereInput
  ): Promise<CareRecordServiceModel | null> {
    const result = await this.databaseService.careRecordService.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });

    return result ? CareRecordServiceMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.CareRecordServiceCreateInput
  ): Promise<CareRecordServiceModel> {
    const result = await this.databaseService.careRecordService.create({
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });

    return CareRecordServiceMapper.toDomain(result);
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
  ): Promise<CareRecordServiceModel> {
    const result = await this.databaseService.careRecordService.update({
      where: { id },
      data,
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });

    return CareRecordServiceMapper.toDomain(result);
  }

  async delete(id: string): Promise<CareRecordServiceModel> {
    const result = await this.databaseService.careRecordService.delete({
      where: { id },
      include: {
        careRecord: true,
        vehicleService: true,
        careRecordChecklists: true,
      },
    });

    return CareRecordServiceMapper.toDomain(result);
  }
}
