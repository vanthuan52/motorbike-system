import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { ServiceChecklist, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServiceChecklistRepository {
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
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<ServiceChecklist[]> {
    const mergedWhere: Prisma.ServiceChecklistWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.serviceChecklist.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        careArea: true,
      },
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.ServiceChecklistWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.serviceChecklist.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.ServiceChecklistSelect,
    Prisma.ServiceChecklistWhereInput
  ): Promise<IPaginationOffsetReturn<ServiceChecklist>> {
    return this.paginationService.offset<
      ServiceChecklist,
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >(
      this.databaseService.serviceChecklist,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careArea: true,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.ServiceChecklistSelect,
    Prisma.ServiceChecklistWhereInput
  ): Promise<IPaginationCursorReturn<ServiceChecklist>> {
    return this.paginationService.cursor<
      ServiceChecklist,
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >(
      this.databaseService.serviceChecklist,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          careArea: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<ServiceChecklist | null> {
    return this.databaseService.serviceChecklist.findUnique({
      where: { id },
      include: {
        careArea: true,
      },
    });
  }

  async findOne(
    where: Prisma.ServiceChecklistWhereInput
  ): Promise<ServiceChecklist | null> {
    return this.databaseService.serviceChecklist.findFirst({
      where,
      include: {
        careArea: true,
      },
    });
  }

  async create(data: Prisma.ServiceChecklistCreateInput): Promise<ServiceChecklist> {
    return this.databaseService.serviceChecklist.create({
      data,
      include: {
        careArea: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ServiceChecklistUpdateInput
  ): Promise<ServiceChecklist> {
    return this.databaseService.serviceChecklist.update({
      where: { id },
      data,
      include: {
        careArea: true,
      },
    });
  }

  async delete(id: string): Promise<ServiceChecklist> {
    return this.databaseService.serviceChecklist.delete({
      where: { id },
      include: {
        careArea: true,
      },
    });
  }

  async createMany(
    data: Prisma.ServiceChecklistCreateInput[]
  ): Promise<number> {
    const result = await this.databaseService.serviceChecklist.createMany({
      data,
    });
    return result.count;
  }
}
