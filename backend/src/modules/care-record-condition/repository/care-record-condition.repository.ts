import { Injectable } from '@nestjs/common';

import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseService } from '@/common/database/services/database.service';
import { CareRecordConditionModel } from '../models/care-record-condition.model';
import { CareRecordConditionMapper } from '../mappers/care-record-condition.mapper';
import {
  Prisma,
  CareRecordCondition as PrismaCareRecordCondition,
} from '@/generated/prisma-client';

@Injectable()
export class CareRecordConditionRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareRecordConditionSelect,
    Prisma.CareRecordConditionWhereInput
  >): Promise<IPaginationOffsetReturn<CareRecordConditionModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaCareRecordCondition>(
        this.databaseService.careRecordCondition,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: { careRecord: true },
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordConditionMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordConditionSelect,
    Prisma.CareRecordConditionWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordConditionModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaCareRecordCondition>(
        this.databaseService.careRecordCondition,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: { careRecord: true },
          includeCount: true,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CareRecordConditionMapper.toDomain(item)
      ),
    };
  }

  async findOneById(
    id: string,
    options?: { join?: boolean }
  ): Promise<CareRecordConditionModel | null> {
    const include = options?.join ? { careRecord: true } : undefined;

    const result = await this.databaseService.careRecordCondition.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include,
    });

    return result ? CareRecordConditionMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.CareRecordConditionCreateInput
  ): Promise<CareRecordConditionModel> {
    const result = await this.databaseService.careRecordCondition.create({
      data,
    });

    return CareRecordConditionMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareRecordConditionUpdateInput
  ): Promise<CareRecordConditionModel> {
    const result = await this.databaseService.careRecordCondition.update({
      where: { id },
      data,
    });

    return CareRecordConditionMapper.toDomain(result);
  }

  async forceDelete(id: string): Promise<CareRecordConditionModel> {
    const result = await this.databaseService.careRecordCondition.delete({
      where: { id },
    });

    return CareRecordConditionMapper.toDomain(result);
  }

  async save(
    data: CareRecordConditionModel
  ): Promise<CareRecordConditionModel> {
    const record = data as any;
    const result = await this.databaseService.careRecordCondition.update({
      where: { id: data.id },
      data: data as any,
    });

    return CareRecordConditionMapper.toDomain(result);
  }

  async softDelete(
    id: string,
    deletedBy?: string
  ): Promise<CareRecordConditionModel> {
    const result = await this.databaseService.careRecordCondition.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });

    return CareRecordConditionMapper.toDomain(result);
  }

  async restore(
    id: string,
    updatedBy?: string
  ): Promise<CareRecordConditionModel> {
    const result = await this.databaseService.careRecordCondition.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy,
      },
    });

    return CareRecordConditionMapper.toDomain(result);
  }
}
