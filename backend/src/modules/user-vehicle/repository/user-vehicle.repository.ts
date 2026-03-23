import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { UserVehicle, Prisma } from '@/generated/prisma-client';

@Injectable()
export class UserVehicleRepository {
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
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<UserVehicle[]> {
    const mergedWhere: Prisma.UserVehicleWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.userVehicle.findMany({
      where: mergedWhere,
      take: limit,
      skip,
      orderBy,
      include: {
        vehicleModel: true,
      },
    });
  }

  async getTotal(
    {
      where,
    }: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    > | { where?: Prisma.UserVehicleWhereInput } = {},
    filters?: Record<string, any>,
  ): Promise<number> {
    const mergedWhere: Prisma.UserVehicleWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.userVehicle.count({
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
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: UserVehicle[]; count: number }> {
    const mergedWhere: Prisma.UserVehicleWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.offsetRaw<UserVehicle>(
      this.databaseService.userVehicle,
      {
        limit,
        skip,
        where: mergedWhere,
        orderBy,
        include: { vehicleModel: true },
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
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: UserVehicle[]; count?: number }> {
    const mergedWhere: Prisma.UserVehicleWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.cursorRaw<UserVehicle>(
      this.databaseService.userVehicle,
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
        include: { vehicleModel: true },
      } as any,
    );
  }

  async findOneById(id: string): Promise<UserVehicle | null> {
    return this.databaseService.userVehicle.findUnique({
      where: { id },
      include: {
        vehicleModel: true,
      },
    });
  }

  async findOne(find: Prisma.UserVehicleWhereInput): Promise<UserVehicle | null> {
    return this.databaseService.userVehicle.findFirst({
      where: find,
      include: {
        vehicleModel: true,
      },
    });
  }

  async create(data: Prisma.UserVehicleCreateInput): Promise<UserVehicle> {
    return this.databaseService.userVehicle.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserVehicleUpdateInput): Promise<UserVehicle> {
    return this.databaseService.userVehicle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<UserVehicle> {
    return this.databaseService.userVehicle.delete({
      where: { id },
    });
  }

  async deleteMany(where: Prisma.UserVehicleWhereInput): Promise<{ count: number }> {
    return this.databaseService.userVehicle.deleteMany({
      where,
    });
  }
}
