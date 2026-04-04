import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServicePriceModel } from '@/modules/service-price/models/service-price.model';
import { ServicePriceMapper } from '../mappers/service-price.mapper';
import {
  Prisma,
  ServicePrice as PrismaServicePrice,
} from '@/generated/prisma-client';

import { IServicePriceListFilters } from '../interfaces/service-price.filter.interface';

@Injectable()
export class ServicePriceRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async getTotal(
    {
      where,
    }: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: IServicePriceListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
      deletedAt: null,
    };

    return this.databaseService.servicePrice.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: IServicePriceListFilters
  ): Promise<IPaginationOffsetReturn<ServicePriceModel>> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
      deletedAt: null,
    };

    const paginatedResult = await this.paginationService.offset<
      PrismaServicePrice,
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >(this.databaseService.servicePrice, {
      limit,
      skip,
      where: mergedWhere,
      orderBy,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ServicePriceMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: IServicePriceListFilters
  ): Promise<IPaginationCursorReturn<ServicePriceModel>> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
      deletedAt: null,
    };

    const paginatedResult = await this.paginationService.cursor<
      PrismaServicePrice,
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >(this.databaseService.servicePrice, {
      limit,
      where: mergedWhere,
      orderBy,
      cursor,
      cursorField,
      includeCount,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ServicePriceMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<ServicePriceModel | null> {
    const result = await this.databaseService.servicePrice.findFirst({
      where: { id, deletedAt: null },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return result ? ServicePriceMapper.toDomain(result) : null;
  }

  async findOne(
    find: Prisma.ServicePriceWhereInput
  ): Promise<ServicePriceModel | null> {
    const result = await this.databaseService.servicePrice.findFirst({
      where: {
        ...find,
        deletedAt: null,
      },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return result ? ServicePriceMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.ServicePriceCreateInput
  ): Promise<ServicePriceModel> {
    const created = await this.databaseService.servicePrice.create({
      data,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(created);
  }

  async update(
    id: string,
    data: Prisma.ServicePriceUpdateInput
  ): Promise<ServicePriceModel> {
    const updated = await this.databaseService.servicePrice.update({
      where: { id, deletedAt: null } as any,
      data,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(updated);
  }

  async forceDelete(id: string): Promise<ServicePriceModel> {
    const deleted = await this.databaseService.servicePrice.delete({
      where: { id },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(deleted);
  }

  async softDelete(id: string, deletedBy: string): Promise<ServicePriceModel> {
    const result = await this.databaseService.servicePrice.update({
      where: { id, deletedAt: null } as any,
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(result);
  }

  async restore(id: string, restoredBy: string): Promise<ServicePriceModel> {
    const result = await this.databaseService.servicePrice.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(result);
  }

  async findOneByIdIncludeDeleted(id: string): Promise<ServicePriceModel | null> {
    const result = await this.databaseService.servicePrice.findUnique({
      where: { id },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return result ? ServicePriceMapper.toDomain(result) : null;
  }

  async findWithPaginationOffsetTrashed({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.ServicePriceSelect,
    Prisma.ServicePriceWhereInput
  >): Promise<IPaginationOffsetReturn<ServicePriceModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaServicePrice,
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >(this.databaseService.servicePrice, {
      ...params,
      where: {
        ...where,
        deletedAt: { not: null },
      },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ServicePriceMapper.toDomain(item)),
    };
  }

  async findAll(
    pagination: {
      limit?: number;
      skip?: number;
      orderBy?: Prisma.ServicePriceOrderByWithRelationInput[];
    },
    filters?: IServicePriceListFilters
  ): Promise<ServicePriceModel[]> {
    const results = await this.databaseService.servicePrice.findMany({
      where: { ...filters, deletedAt: null },
      take: pagination.limit || 100,
      skip: pagination.skip || 0,
      orderBy: pagination.orderBy || [{ dateStart: 'desc' }],
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return results.map(item => ServicePriceMapper.toDomain(item));
  }

  async findLatestPrices(params?: {
    where?: Prisma.ServicePriceWhereInput;
    limit?: number;
    skip?: number;
    orderBy?: Prisma.ServicePriceOrderByWithRelationInput[];
  }): Promise<ServicePriceModel[]> {
    const results = await this.databaseService.servicePrice.findMany({
      where: { ...params?.where, deletedAt: null },
      take: params?.limit,
      skip: params?.skip,
      orderBy: params?.orderBy || [{ dateStart: 'desc' }],
      distinct: ['vehicleServiceId', 'vehicleModelId'],
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return results.map(item => ServicePriceMapper.toDomain(item));
  }

  async countLatestPrices(
    where?: Prisma.ServicePriceWhereInput
  ): Promise<number> {
    const results = await this.databaseService.servicePrice.findMany({
      where: { ...where, deletedAt: null },
      distinct: ['vehicleServiceId', 'vehicleModelId'],
      select: { id: true },
    });
    return results.length;
  }
}
