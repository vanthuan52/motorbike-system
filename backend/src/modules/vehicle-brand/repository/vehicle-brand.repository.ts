import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IVehicleBrandListFilters } from '../interfaces/vehicle-brand.filter.interface';
import {
  VehicleBrand as PrismaVehicleBrand,
  Prisma,
} from '@/generated/prisma-client';
import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { VehicleBrandMapper } from '../mappers/vehicle-brand.mapper';

@Injectable()
export class VehicleBrandRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: IVehicleBrandListFilters
  ): Promise<IPaginationOffsetReturn<VehicleBrandModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaVehicleBrand,
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >(this.databaseService.vehicleBrand, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => VehicleBrandMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: IVehicleBrandListFilters
  ): Promise<IPaginationCursorReturn<VehicleBrandModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaVehicleBrand,
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >(this.databaseService.vehicleBrand, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => VehicleBrandMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<VehicleBrandModel | null> {
    const result = await this.databaseService.vehicleBrand.findUnique({
      where: { id },
    });
    return result ? VehicleBrandMapper.toDomain(result) : null;
  }

  async findOne(
    find: Prisma.VehicleBrandWhereInput
  ): Promise<VehicleBrandModel | null> {
    const result = await this.databaseService.vehicleBrand.findFirst({
      where: find,
    });
    return result ? VehicleBrandMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<VehicleBrandModel | null> {
    const result = await this.databaseService.vehicleBrand.findFirst({
      where: { slug },
    });
    return result ? VehicleBrandMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.VehicleBrandCreateInput
  ): Promise<VehicleBrandModel> {
    const result = await this.databaseService.vehicleBrand.create({
      data,
    });
    return VehicleBrandMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.VehicleBrandUpdateInput
  ): Promise<VehicleBrandModel> {
    const result = await this.databaseService.vehicleBrand.update({
      where: { id },
      data,
    });
    return VehicleBrandMapper.toDomain(result);
  }

  async delete(id: string): Promise<VehicleBrandModel> {
    const result = await this.databaseService.vehicleBrand.delete({
      where: { id },
    });
    return VehicleBrandMapper.toDomain(result);
  }

  async deleteMany(
    where: Prisma.VehicleBrandWhereInput
  ): Promise<{ count: number }> {
    return this.databaseService.vehicleBrand.deleteMany({
      where,
    });
  }

  async getTotal(where: Prisma.VehicleBrandWhereInput): Promise<number> {
    return this.databaseService.vehicleBrand.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
