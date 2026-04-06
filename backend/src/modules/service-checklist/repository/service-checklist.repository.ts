import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { ServiceChecklist as PrismaServiceChecklist, Prisma } from '@/generated/prisma-client';
import { IServiceChecklistListFilters } from '../interfaces/service-checklist.filter.interface';
import { ServiceChecklistModel } from '../models/service-checklist.model';
import { ServiceChecklistMapper } from '../mappers/service-checklist.mapper';

const CHECKLIST_INCLUDE = {
  careArea: true,
  vehicleService: true,
} as const;

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
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<ServiceChecklistModel[]> {
    const mergedWhere: Prisma.ServiceChecklistWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.serviceChecklist.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: CHECKLIST_INCLUDE,
    });

    return results.map(item => ServiceChecklistMapper.toDomain(item));
  }

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaServiceChecklist>(
        this.databaseService.serviceChecklist,
        {
          ...params,
          where: {
            ...where,
            ...filters,
            deletedAt: null,
          },
          include: CHECKLIST_INCLUDE,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ServiceChecklistMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >
  ): Promise<IPaginationCursorReturn<ServiceChecklistModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaServiceChecklist>(
        this.databaseService.serviceChecklist,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: CHECKLIST_INCLUDE,
          includeCount: true,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ServiceChecklistMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationOffsetTrashed(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaServiceChecklist>(
        this.databaseService.serviceChecklist,
        {
          ...params,
          where: {
            ...where,
            ...filters,
            deletedAt: { not: null },
          },
          include: CHECKLIST_INCLUDE,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ServiceChecklistMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<ServiceChecklistModel | null> {
    const result = await this.databaseService.serviceChecklist.findFirst({
      where: { id, deletedAt: null },
      include: CHECKLIST_INCLUDE,
    });
    return result ? ServiceChecklistMapper.toDomain(result) : null;
  }

  async findOneByIdIncludeDeleted(
    id: string
  ): Promise<ServiceChecklistModel | null> {
    const result = await this.databaseService.serviceChecklist.findUnique({
      where: { id },
      include: CHECKLIST_INCLUDE,
    });
    return result ? ServiceChecklistMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.ServiceChecklistWhereInput
  ): Promise<ServiceChecklistModel | null> {
    const result = await this.databaseService.serviceChecklist.findFirst({
      where: { ...where, deletedAt: null },
      include: CHECKLIST_INCLUDE,
    });
    return result ? ServiceChecklistMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.ServiceChecklistCreateInput
  ): Promise<ServiceChecklistModel> {
    const result = await this.databaseService.serviceChecklist.create({
      data,
      include: CHECKLIST_INCLUDE,
    });
    return ServiceChecklistMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.ServiceChecklistUpdateInput
  ): Promise<ServiceChecklistModel> {
    const result = await this.databaseService.serviceChecklist.update({
      where: { id },
      data,
      include: CHECKLIST_INCLUDE,
    });
    return ServiceChecklistMapper.toDomain(result);
  }

  async softDelete(
    id: string,
    deletedBy: string
  ): Promise<ServiceChecklistModel> {
    const result = await this.databaseService.serviceChecklist.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
      include: CHECKLIST_INCLUDE,
    });
    return ServiceChecklistMapper.toDomain(result);
  }

  async restore(
    id: string,
    restoredBy: string
  ): Promise<ServiceChecklistModel> {
    const result = await this.databaseService.serviceChecklist.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
      include: CHECKLIST_INCLUDE,
    });
    return ServiceChecklistMapper.toDomain(result);
  }

  async forceDelete(id: string): Promise<ServiceChecklistModel> {
    const result = await this.databaseService.serviceChecklist.delete({
      where: { id },
      include: CHECKLIST_INCLUDE,
    });
    return ServiceChecklistMapper.toDomain(result);
  }

  async createMany(
    data: Prisma.ServiceChecklistCreateManyInput[]
  ): Promise<number> {
    const result = await this.databaseService.serviceChecklist.createMany({
      data,
    });
    return result.count;
  }

  async deleteMany(
    where: Prisma.ServiceChecklistWhereInput = {}
  ): Promise<{ count: number }> {
    return this.databaseService.serviceChecklist.deleteMany({ where });
  }
}
