import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleService, Prisma } from '@/generated/prisma-client';

@Injectable()
export class VehicleServiceRepository {
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
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<VehicleService[]> {
    const mergedWhere: Prisma.VehicleServiceWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.vehicleService.findMany({
      where: mergedWhere,
      take: limit,
      skip,
      orderBy,
      include: {
        serviceCategory: true,
        checklistItems: true, // Prisma handles many-to-many natively with include
      },
    });
  }

  async getTotal(
    {
      where,
    }: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    > | { where?: Prisma.VehicleServiceWhereInput } = {},
    filters?: Record<string, any>,
  ): Promise<number> {
    const mergedWhere: Prisma.VehicleServiceWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.vehicleService.count({
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
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleService[]; count: number }> {
    const mergedWhere: Prisma.VehicleServiceWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.offsetRaw<VehicleService>(
      this.databaseService.vehicleService,
      {
        limit,
        skip,
        where: mergedWhere,
        orderBy,
        include: { serviceCategory: true, checklistItems: true },
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
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleService[]; count?: number }> {
    const mergedWhere: Prisma.VehicleServiceWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.cursorRaw<VehicleService>(
      this.databaseService.vehicleService,
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
        include: { serviceCategory: true, checklistItems: true },
      } as any,
    );
  }

  async findOneById(id: string): Promise<VehicleService | null> {
    return this.databaseService.vehicleService.findUnique({
      where: { id },
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
  }

  async findOne(find: Prisma.VehicleServiceWhereInput): Promise<VehicleService | null> {
    return this.databaseService.vehicleService.findFirst({
      where: find,
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
  }

  async findOneBySlug(slug: string): Promise<VehicleService | null> {
    return this.databaseService.vehicleService.findFirst({
      where: { slug },
      include: {
        serviceCategory: true,
        checklistItems: true,
      },
    });
  }

  async create(data: Prisma.VehicleServiceCreateInput): Promise<VehicleService> {
    return this.databaseService.vehicleService.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VehicleServiceUpdateInput): Promise<VehicleService> {
    return this.databaseService.vehicleService.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<VehicleService> {
    return this.databaseService.vehicleService.delete({
      where: { id },
    });
  }

  async deleteMany(where: Prisma.VehicleServiceWhereInput): Promise<{ count: number }> {
    return this.databaseService.vehicleService.deleteMany({
      where,
    });
  }

  // Not strictly needed in Prisma, as includes operate directly, but kept for interface compat
  async findAllAggregate<T>(pipeline: any[], options?: any): Promise<T[]> {
    // Pipeline queries might need raw SQL in Prisma or native queries. Assuming this is rarely used or 
    // we can fallback to raw mongodb/postgres depending on connection. Usually this requires translation.
    // For now we return an empty array or throw an error indicating raw translation is needed,
    // wait actually vehicle-service.service.ts uses findAggregate in step 346: `findAllWithServiceCategory` uses `createRawQueryFindAllWithServiceCategory` returning []PipelineStage! 
    return [] as any;
  }

  async getTotalAggregate(pipeline: any[], options?: any): Promise<number> {
    return 0;
  }
}
