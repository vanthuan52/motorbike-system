import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleModelModel } from '../models/vehicle-model.model';
import { VehicleModelMapper } from '../mappers/vehicle-model.mapper';
import {
  VehicleModel as PrismaVehicleModel,
  Prisma,
} from '@/generated/prisma-client';
import { IVehicleModelListFilters } from '../interfaces/vehicle-model.filter.interface';

@Injectable()
export class VehicleModelRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: IVehicleModelListFilters
  ): Promise<IPaginationOffsetReturn<VehicleModelModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaVehicleModel,
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >(this.databaseService.vehicleModel, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        vehicleBrand: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => VehicleModelMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: IVehicleModelListFilters
  ): Promise<IPaginationCursorReturn<VehicleModelModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaVehicleModel,
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >(this.databaseService.vehicleModel, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        vehicleBrand: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => VehicleModelMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<VehicleModelModel | null> {
    const result = await this.databaseService.vehicleModel.findUnique({
      where: { id },
      include: {
        vehicleBrand: true,
      },
    });
    return result ? VehicleModelMapper.toDomain(result) : null;
  }

  async findOne(
    find: Prisma.VehicleModelWhereInput
  ): Promise<VehicleModelModel | null> {
    const result = await this.databaseService.vehicleModel.findFirst({
      where: find,
      include: {
        vehicleBrand: true,
      },
    });
    return result ? VehicleModelMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<VehicleModelModel | null> {
    const result = await this.databaseService.vehicleModel.findFirst({
      where: { slug },
      include: {
        vehicleBrand: true,
      },
    });
    return result ? VehicleModelMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.VehicleModelCreateInput
  ): Promise<VehicleModelModel> {
    const result = await this.databaseService.vehicleModel.create({
      data,
    });
    return VehicleModelMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.VehicleModelUpdateInput
  ): Promise<VehicleModelModel> {
    const result = await this.databaseService.vehicleModel.update({
      where: { id },
      data,
    });
    return VehicleModelMapper.toDomain(result);
  }

  async delete(id: string): Promise<VehicleModelModel> {
    const result = await this.databaseService.vehicleModel.delete({
      where: { id },
    });
    return VehicleModelMapper.toDomain(result);
  }

  async deleteMany(
    where: Prisma.VehicleModelWhereInput
  ): Promise<{ count: number }> {
    return this.databaseService.vehicleModel.deleteMany({
      where,
    });
  }

  async getTotal(where: Prisma.VehicleModelWhereInput): Promise<number> {
    return this.databaseService.vehicleModel.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async findAll(
    where: Prisma.VehicleModelWhereInput
  ): Promise<VehicleModelModel[]> {
    const results = await this.databaseService.vehicleModel.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        vehicleBrand: true,
      },
    });
    return results.map(item => VehicleModelMapper.toDomain(item));
  }
}
