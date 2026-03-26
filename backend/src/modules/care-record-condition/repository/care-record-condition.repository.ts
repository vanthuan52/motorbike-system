import { Injectable } from '@nestjs/common';

import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseService } from '@/common/database/services/database.service';
import { CareRecordCondition, Prisma } from '@/generated/prisma-client';

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
  >): Promise<IPaginationOffsetReturn<CareRecordCondition>> {
    return this.paginationService.offset<CareRecordCondition>(
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
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareRecordConditionSelect,
    Prisma.CareRecordConditionWhereInput
  >): Promise<IPaginationCursorReturn<CareRecordCondition>> {
    return this.paginationService.cursor<CareRecordCondition>(
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
  }

  async findOneById<T = CareRecordCondition>(
    id: string,
    options?: { join?: boolean }
  ): Promise<T | null> {
    const include = options?.join ? { careRecord: true } : undefined;

    return this.databaseService.careRecordCondition.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include,
    }) as Promise<T | null>;
  }

  async create<T = CareRecordCondition>(
    data: Prisma.CareRecordConditionCreateInput
  ): Promise<T> {
    return this.databaseService.careRecordCondition.create({
      data,
    }) as Promise<T>;
  }

  async update<T = CareRecordCondition>(
    id: string,
    data: Prisma.CareRecordConditionUpdateInput
  ): Promise<T> {
    return this.databaseService.careRecordCondition.update({
      where: { id },
      data,
    }) as Promise<T>;
  }

  async delete<T = CareRecordCondition>(id: string): Promise<T> {
    return this.databaseService.careRecordCondition.delete({
      where: { id },
    }) as Promise<T>;
  }

  async save<T = CareRecordCondition>(data: T): Promise<T> {
    const record = data as any;
    return this.databaseService.careRecordCondition.update({
      where: { id: record.id },
      data: record,
    }) as Promise<T>;
  }

  async softDelete<T = CareRecordCondition>(data: any): Promise<T> {
    return this.databaseService.careRecordCondition.delete({
      where: { id: data.id },
    }) as Promise<T>;
  }
}
