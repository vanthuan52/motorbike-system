import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
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
    Prisma.AppointmentSelect,
    Prisma.AppointmentWhereInput
  >): Promise<IPaginationOffsetReturn<Appointment>> {
    return this.paginationService.offset<Appointment>(
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
    Prisma.AppointmentSelect,
    Prisma.AppointmentWhereInput
  >): Promise<IPaginationCursorReturn<Appointment>> {
    return this.paginationService.cursor<Appointment>(
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
