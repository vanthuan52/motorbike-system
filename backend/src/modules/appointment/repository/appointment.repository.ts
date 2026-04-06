import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationCursorReturn,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { AppointmentModel } from '../models/appointment.model';
import { AppointmentMapper } from '../mappers/appointment.mapper';
import {
  Prisma,
  Appointment as PrismaAppointment,
} from '@/generated/prisma-client';
import { IAppointmentListFilters } from '../interfaces/appointment.filter.interface';

@Injectable()
export class AppointmentRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findAll(
    {
      where: baseWhere,
      skip,
      limit,
      orderBy,
      ...rest
    }: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: IAppointmentListFilters
  ): Promise<AppointmentModel[]> {
    const mergedWhere: Prisma.AppointmentWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    const results = await this.databaseService.appointment.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
      ...rest,
    });

    return results.map(item => AppointmentMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: IAppointmentListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.AppointmentWhereInput = {
      ...baseWhere,
      ...filters,
      deletedAt: null,
    };

    return this.databaseService.appointment.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: IAppointmentListFilters
  ): Promise<IPaginationOffsetReturn<AppointmentModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaAppointment>(
        this.databaseService.appointment,
        {
          ...params,
          where: {
            ...where,
            ...filters,
            deletedAt: null,
          },
          include: {
            user: false,
          },
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => AppointmentMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.AppointmentSelect,
    Prisma.AppointmentWhereInput
  >): Promise<IPaginationCursorReturn<AppointmentModel>> {
    const paginatedResult =
      await this.paginationService.cursor<PrismaAppointment>(
        this.databaseService.appointment,
        {
          ...params,
          where: {
            ...where,
            deletedAt: null,
          },
          include: {
            user: false,
          },
          includeCount: true,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => AppointmentMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<AppointmentModel | null> {
    const result = await this.databaseService.appointment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return result ? AppointmentMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.AppointmentWhereInput
  ): Promise<AppointmentModel | null> {
    const result = await this.databaseService.appointment.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return result ? AppointmentMapper.toDomain(result) : null;
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<AppointmentModel> {
    const result = await this.databaseService.appointment.create({
      data,
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return AppointmentMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.AppointmentUpdateInput
  ): Promise<AppointmentModel> {
    const result = await this.databaseService.appointment.update({
      where: {
        id,
        deletedAt: null,
      },
      data,
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return AppointmentMapper.toDomain(result);
  }

  /**
   * Soft delete: sets deletedAt and deletedBy instead of removing the record.
   */
  async softDelete(id: string, deletedBy: string): Promise<AppointmentModel> {
    const result = await this.databaseService.appointment.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return AppointmentMapper.toDomain(result);
  }

  /**
   * Restore a soft-deleted record by clearing deletedAt and deletedBy.
   */
  async restore(id: string, restoredBy: string): Promise<AppointmentModel> {
    const result = await this.databaseService.appointment.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return AppointmentMapper.toDomain(result);
  }

  /**
   * Permanently remove a record from the database.
   * WARNING: This action is irreversible.
   */
  async forceDelete(id: string): Promise<AppointmentModel> {
    const result = await this.databaseService.appointment.delete({
      where: { id },
    });

    return AppointmentMapper.toDomain(result);
  }

  /**
   * Find an appointment by ID regardless of soft-delete status.
   * Used for restore and trash detail operations.
   */
  async findOneByIdIncludeDeleted(
    id: string
  ): Promise<AppointmentModel | null> {
    const result = await this.databaseService.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return result ? AppointmentMapper.toDomain(result) : null;
  }

  /**
   * Find trashed (soft-deleted) appointments with pagination.
   * Only returns records WHERE deletedAt IS NOT NULL.
   */
  async findWithPaginationOffsetTrashed(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: IAppointmentListFilters
  ): Promise<IPaginationOffsetReturn<AppointmentModel>> {
    const paginatedResult =
      await this.paginationService.offset<PrismaAppointment>(
        this.databaseService.appointment,
        {
          ...params,
          where: {
            ...where,
            ...filters,
            deletedAt: { not: null },
          },
          include: {
            user: false,
          },
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => AppointmentMapper.toDomain(item)),
    };
  }
}
