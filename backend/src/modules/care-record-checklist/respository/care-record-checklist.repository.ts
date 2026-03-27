import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareRecordChecklistModel } from '../models/care-record-checklist.model';
import { CareRecordChecklistMapper } from '../mappers/care-record-checklist.mapper';
import {
  CareRecordChecklist as PrismaCareRecordChecklist,
  Prisma,
} from '@/generated/prisma-client';

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
  ): Promise<CareRecordChecklistModel[]> {
    const mergedWhere: Prisma.CareRecordChecklistWhereInput = {
      ...baseWhere,
      ...filters,
    };

    const results = await this.databaseService.careRecordChecklist.findMany({
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

    return results.map((item: PrismaCareRecordChecklist) =>
      CareRecordChecklistMapper.toDomain(item)
    );
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
  >): Promise<IPaginationOffsetReturn<CareRecordChecklistModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaCareRecordChecklist>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordChecklistMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordChecklistSelect,
    Prisma.CareRecordChecklistWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordChecklistModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaCareRecordChecklist>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordChecklistMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<CareRecordChecklistModel | null> {
    const result = await this.databaseService.careRecordChecklist.findUnique({
      where: { id },
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });

    return result ? CareRecordChecklistMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareRecordChecklistWhereInput
  ): Promise<CareRecordChecklistModel | null> {
    const result = await this.databaseService.careRecordChecklist.findFirst({
      where,
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });

    return result ? CareRecordChecklistMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.CareRecordChecklistCreateInput
  ): Promise<CareRecordChecklistModel> {
    const result = await this.databaseService.careRecordChecklist.create({
      data,
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });

    return CareRecordChecklistMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareRecordChecklistUpdateInput
  ): Promise<CareRecordChecklistModel> {
    const result = await this.databaseService.careRecordChecklist.update({
      where: { id },
      data,
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });

    return CareRecordChecklistMapper.toDomain(result);
  }

  async delete(id: string): Promise<CareRecordChecklistModel> {
    const result = await this.databaseService.careRecordChecklist.delete({
      where: { id },
      include: {
        careRecordService: true,
        serviceChecklist: true,
      },
    });

    return CareRecordChecklistMapper.toDomain(result);
  }

  async deleteMany(where: Prisma.CareRecordChecklistWhereInput): Promise<void> {
    await this.databaseService.careRecordChecklist.deleteMany({
      where,
    });
  }
}
