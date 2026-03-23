import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleBrand, Prisma } from '@/generated/prisma-client';

@Injectable()
export class VehicleBrandRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<VehicleBrand[]> {
    const mergedWhere: Prisma.VehicleBrandWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.vehicleBrand.findMany({
      where: mergedWhere,
      take: limit,
      skip,
      orderBy,
    });
  }

  async getTotal(
    {
      where,
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    > | { where?: Prisma.VehicleBrandWhereInput } = {},
    filters?: Record<string, any>,
  ): Promise<number> {
    const mergedWhere: Prisma.VehicleBrandWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.vehicleBrand.count({
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
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleBrand[]; count: number }> {
    const mergedWhere: Prisma.VehicleBrandWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.offsetRaw<VehicleBrand>(
      this.databaseService.vehicleBrand,
      {
        limit,
        skip,
        where: mergedWhere,
        orderBy,
      },
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
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleBrand[]; count?: number }> {
    const mergedWhere: Prisma.VehicleBrandWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.cursorRaw<VehicleBrand>(
      this.databaseService.vehicleBrand,
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      },
    );
  }

  async findOneById(id: string): Promise<VehicleBrand | null> {
    return this.databaseService.vehicleBrand.findUnique({
      where: { id },
    });
  }

  async findOne(find: Prisma.VehicleBrandWhereInput): Promise<VehicleBrand | null> {
    return this.databaseService.vehicleBrand.findFirst({
      where: find,
    });
  }

  async findOneBySlug(slug: string): Promise<VehicleBrand | null> {
    return this.databaseService.vehicleBrand.findFirst({
      where: { slug },
    });
  }

  async create(data: Prisma.VehicleBrandCreateInput): Promise<VehicleBrand> {
    return this.databaseService.vehicleBrand.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VehicleBrandUpdateInput): Promise<VehicleBrand> {
    return this.databaseService.vehicleBrand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<VehicleBrand> {
    return this.databaseService.vehicleBrand.delete({
      where: { id },
    });
  }

  async deleteMany(where: Prisma.VehicleBrandWhereInput): Promise<{ count: number }> {
    return this.databaseService.vehicleBrand.deleteMany({
      where,
    });
  }
}
