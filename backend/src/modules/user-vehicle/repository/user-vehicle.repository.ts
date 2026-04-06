import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationCursorReturn,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { UserVehicleModel } from '../models/user-vehicle.model';
import { UserVehicleMapper } from '../mappers/user-vehicle.mapper';
import {
  Prisma,
  UserVehicle as PrismaUserVehicle,
} from '@/generated/prisma-client';

import { IUserVehicleListFilters } from '../interfaces/user-vehicle.filter.interface';

@Injectable()
export class UserVehicleRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: IUserVehicleListFilters
  ): Promise<IPaginationOffsetReturn<UserVehicleModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaUserVehicle,
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >(this.databaseService.userVehicle, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: { vehicleModel: true },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => UserVehicleMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: IUserVehicleListFilters
  ): Promise<IPaginationCursorReturn<UserVehicleModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaUserVehicle,
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >(this.databaseService.userVehicle, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: { vehicleModel: true },
      includeCount: true,
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => UserVehicleMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<UserVehicleModel | null> {
    const result = await this.databaseService.userVehicle.findUnique({
      where: { id },
      include: {
        vehicleModel: true,
      },
    });
    return result ? UserVehicleMapper.toDomain(result) : null;
  }

  async findOne(
    find: Prisma.UserVehicleWhereInput
  ): Promise<UserVehicleModel | null> {
    const result = await this.databaseService.userVehicle.findFirst({
      where: find,
      include: {
        vehicleModel: true,
      },
    });
    return result ? UserVehicleMapper.toDomain(result) : null;
  }

  async create(data: Prisma.UserVehicleCreateInput): Promise<UserVehicleModel> {
    const result = await this.databaseService.userVehicle.create({
      data,
      include: {
        vehicleModel: true,
      },
    });
    return UserVehicleMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.UserVehicleUpdateInput
  ): Promise<UserVehicleModel> {
    const result = await this.databaseService.userVehicle.update({
      where: { id },
      data,
      include: {
        vehicleModel: true,
      },
    });
    return UserVehicleMapper.toDomain(result);
  }

  async delete(id: string): Promise<UserVehicleModel> {
    const result = await this.databaseService.userVehicle.delete({
      where: { id },
    });
    return UserVehicleMapper.toDomain(result);
  }

  async deleteMany(
    where: Prisma.UserVehicleWhereInput
  ): Promise<{ count: number }> {
    return this.databaseService.userVehicle.deleteMany({
      where,
    });
  }

  async getTotal(where: Prisma.UserVehicleWhereInput): Promise<number> {
    return this.databaseService.userVehicle.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
