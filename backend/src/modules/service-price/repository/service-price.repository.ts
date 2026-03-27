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
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
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
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServicePriceModel>> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
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
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServicePriceModel>> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
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
    const result = await this.databaseService.servicePrice.findUnique({
      where: { id },
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
      where: find,
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
      where: { id },
      data,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(updated);
  }

  async delete(id: string): Promise<ServicePriceModel> {
    const deleted = await this.databaseService.servicePrice.delete({
      where: { id },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
    return ServicePriceMapper.toDomain(deleted);
  }

  async findAll(
    pagination: {
      limit?: number;
      skip?: number;
      orderBy?: Prisma.ServicePriceOrderByWithRelationInput[];
    },
    filters?: Prisma.ServicePriceWhereInput
  ): Promise<ServicePriceModel[]> {
    const results = await this.databaseService.servicePrice.findMany({
      where: filters,
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
      where: params?.where,
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
      where,
      distinct: ['vehicleServiceId', 'vehicleModelId'],
      select: { id: true },
    });
    return results.length;
  }
}
