import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleModel, Prisma } from '@/generated/prisma-client';

@Injectable()
export class VehicleModelRepository {
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
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<VehicleModel[]> {
    const mergedWhere: Prisma.VehicleModelWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.vehicleModel.findMany({
      where: mergedWhere,
      take: limit,
      skip,
      orderBy,
      include: {
        vehicleBrand: true,
      },
    });
  }

  async getTotal(
    {
      where,
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    > | { where?: Prisma.VehicleModelWhereInput } = {},
    filters?: Record<string, any>,
  ): Promise<number> {
    const mergedWhere: Prisma.VehicleModelWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.vehicleModel.count({
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
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleModel[]; count: number }> {
    const mergedWhere: Prisma.VehicleModelWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.offsetRaw<VehicleModel>(
      this.databaseService.vehicleModel,
      {
        limit,
        skip,
        where: mergedWhere,
        orderBy,
        include: { vehicleBrand: true },
      } as any,
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
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleModel[]; count?: number }> {
    const mergedWhere: Prisma.VehicleModelWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.cursorRaw<VehicleModel>(
      this.databaseService.vehicleModel,
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
        include: { vehicleBrand: true },
      } as any,
    );
  }

  async findOneById(id: string): Promise<VehicleModel | null> {
    return this.databaseService.vehicleModel.findUnique({
      where: { id },
      include: {
        vehicleBrand: true,
      },
    });
  }

  async findOne(find: Prisma.VehicleModelWhereInput): Promise<VehicleModel | null> {
    return this.databaseService.vehicleModel.findFirst({
      where: find,
      include: {
        vehicleBrand: true,
      },
    });
  }

  async findOneBySlug(slug: string): Promise<VehicleModel | null> {
    return this.databaseService.vehicleModel.findFirst({
      where: { slug },
      include: {
        vehicleBrand: true,
      },
    });
  }

  async create(data: Prisma.VehicleModelCreateInput): Promise<VehicleModel> {
    return this.databaseService.vehicleModel.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VehicleModelUpdateInput): Promise<VehicleModel> {
    return this.databaseService.vehicleModel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<VehicleModel> {
    return this.databaseService.vehicleModel.delete({
      where: { id },
    });
  }

  async deleteMany(where: Prisma.VehicleModelWhereInput): Promise<{ count: number }> {
    return this.databaseService.vehicleModel.deleteMany({
      where,
    });
  }
}
