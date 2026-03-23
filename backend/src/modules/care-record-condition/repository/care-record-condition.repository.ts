import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/services/prisma.service';
import { CareRecordCondition, Prisma } from '@prisma/client';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';

@Injectable()
export class CareRecordConditionRepository extends DatabaseRepositoryBase {
  constructor(private readonly databaseService: PrismaService) {
    super(databaseService);
  }

  async findAll<T = CareRecordCondition>(
    find: Prisma.CareRecordConditionWhereInput,
    options: {
      paging?: { limit: number; offset: number };
      order?: Record<string, 'asc' | 'desc'>;
      join?: boolean;
    } = {}
  ): Promise<T[]> {
    const { limit, offset } = options.paging || { limit: 10, offset: 0 };
    const include = options.join ? { careRecord: true } : undefined;

    return this.databaseService.careRecordCondition.findMany({
      where: find,
      include,
      skip: offset,
      take: limit,
      orderBy: options.order,
    }) as Promise<T[]>;
  }

  async getTotal(find: Prisma.CareRecordConditionWhereInput): Promise<number> {
    return this.databaseService.careRecordCondition.count({ where: find });
  }

  async findWithPaginationOffset<T = CareRecordCondition>(
    find: Prisma.CareRecordConditionWhereInput,
    options: {
      limit: number;
      offset: number;
      orderBy?: Record<string, 'asc' | 'desc'>;
      join?: boolean;
    }
  ): Promise<[T[], number]> {
    const { limit, offset, orderBy, join } = options;
    const include = join ? { careRecord: true } : undefined;

    const [data, total] = await Promise.all([
      this.databaseService.careRecordCondition.findMany({
        where: find,
        include,
        skip: offset,
        take: limit,
        orderBy,
      }) as Promise<T[]>,
      this.databaseService.careRecordCondition.count({ where: find }),
    ]);

    return [data, total];
  }

  async findOneById<T = CareRecordCondition>(
    id: string,
    options?: { join?: boolean }
  ): Promise<T | null> {
    const include = options?.join ? { careRecord: true } : undefined;

    return this.databaseService.careRecordCondition.findUnique({
      where: { id },
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
