import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { Appointment, Prisma } from '@/generated/prisma-client';

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
    filters?: Record<string, any>
  ): Promise<Appointment[]> {
    const mergedWhere: Prisma.AppointmentWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.appointment.findMany({
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
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.AppointmentWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.appointment.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.ActivityLogSelect,
    Prisma.ActivityLogWhereInput
  >): Promise<{
    data: Appointment[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<Appointment>(
      this.databaseService.appointment,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          user: false,
        },
      }
    );
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.ApiKeySelect,
    Prisma.ApiKeyWhereInput
  >): Promise<{
    data: Appointment[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<Appointment>(
      this.databaseService.appointment,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          user: false,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<Appointment | null> {
    return this.databaseService.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });
  }

  async findOne(
    where: Prisma.AppointmentWhereInput
  ): Promise<Appointment | null> {
    return this.databaseService.appointment.findFirst({
      where,
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.databaseService.appointment.create({
      data,
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.AppointmentUpdateInput
  ): Promise<Appointment> {
    return this.databaseService.appointment.update({
      where: { id },
      data,
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });
  }

  async delete(id: string): Promise<Appointment> {
    return this.databaseService.appointment.delete({
      where: { id },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });
  }
}
