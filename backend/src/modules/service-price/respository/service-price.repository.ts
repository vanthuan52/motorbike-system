import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServicePrice, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServicePriceRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findAll(
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
  ): Promise<ServicePrice[]> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.servicePrice.findMany({
      where: mergedWhere,
      take: limit,
      skip,
      orderBy,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
  }

  async getTotal(
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
  ): Promise<IPaginationOffsetReturn<ServicePrice>> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.offset<
      ServicePrice,
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >(
      this.databaseService.servicePrice,
      {
        limit,
        skip,
        where: mergedWhere,
        orderBy,
      },
      {
        include: {
          vehicleService: true,
          vehicleModel: true,
        },
      }
    );
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
  ): Promise<IPaginationCursorReturn<ServicePrice>> {
    const mergedWhere: Prisma.ServicePriceWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.cursor<
      ServicePrice,
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >(
      this.databaseService.servicePrice,
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      },
      {
        include: {
          vehicleService: true,
          vehicleModel: true,
        },
      }
    );
  }

  async findOneById(id: string): Promise<ServicePrice | null> {
    return this.databaseService.servicePrice.findUnique({
      where: { id },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
  }

  async findOne(find: Record<string, any>): Promise<ServicePrice | null> {
    return this.databaseService.servicePrice.findFirst({
      where: find,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
  }

  async create(data: Prisma.ServicePriceCreateInput): Promise<ServicePrice> {
    return this.databaseService.servicePrice.create({
      data,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ServicePriceUpdateInput
  ): Promise<ServicePrice> {
    return this.databaseService.servicePrice.update({
      where: { id },
      data,
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
  }

  async delete(id: string): Promise<ServicePrice> {
    return this.databaseService.servicePrice.delete({
      where: { id },
      include: {
        vehicleService: true,
        vehicleModel: true,
      },
    });
  }
}
