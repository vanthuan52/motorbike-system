import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IVehicleServiceListFilters } from '../interfaces/vehicle-service.filter.interface';
import { VehicleServiceModel } from '@/modules/vehicle-service/models/vehicle-service.model';
import { VehicleServiceMapper } from '../mappers/vehicle-service.mapper';
import {
  VehicleService as PrismaVehicleService,
  Prisma,
} from '@/generated/prisma-client';

@Injectable()
export class VehicleServiceRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: IVehicleServiceListFilters
  ): Promise<IPaginationOffsetReturn<VehicleServiceModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaVehicleService,
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >(this.databaseService.vehicleService, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: { serviceCategory: true, checklistItems: true },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        VehicleServiceMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: IVehicleServiceListFilters
  ): Promise<IPaginationCursorReturn<VehicleServiceModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaVehicleService,
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >(this.databaseService.vehicleService, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: { serviceCategory: true, checklistItems: true },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        VehicleServiceMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<VehicleServiceModel | null> {
    const result = await this.databaseService.vehicleService.findUnique({
      where: { id },
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
    return result ? VehicleServiceMapper.toDomain(result) : null;
  }

  async findOne(
    find: Prisma.VehicleServiceWhereInput
  ): Promise<VehicleServiceModel | null> {
    const result = await this.databaseService.vehicleService.findFirst({
      where: find,
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
    return result ? VehicleServiceMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<VehicleServiceModel | null> {
    const result = await this.databaseService.vehicleService.findFirst({
      where: { slug },
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
    return result ? VehicleServiceMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.VehicleServiceCreateInput
  ): Promise<VehicleServiceModel> {
    const result = await this.databaseService.vehicleService.create({
      data,
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
    return VehicleServiceMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.VehicleServiceUpdateInput
  ): Promise<VehicleServiceModel> {
    const result = await this.databaseService.vehicleService.update({
      where: { id },
      data,
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
    return VehicleServiceMapper.toDomain(result);
  }

  async delete(id: string): Promise<VehicleServiceModel> {
    const result = await this.databaseService.vehicleService.delete({
      where: { id },
    });
    return VehicleServiceMapper.toDomain(result);
  }

  async deleteMany(
    where: Prisma.VehicleServiceWhereInput
  ): Promise<{ count: number }> {
    return this.databaseService.vehicleService.deleteMany({
      where,
    });
  }

  async getTotal(where: Prisma.VehicleServiceWhereInput): Promise<number> {
    return this.databaseService.vehicleService.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async findAll(
    where: Prisma.VehicleServiceWhereInput
  ): Promise<VehicleServiceModel[]> {
    const results = await this.databaseService.vehicleService.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
    return results.map(item => VehicleServiceMapper.toDomain(item));
  }
}
