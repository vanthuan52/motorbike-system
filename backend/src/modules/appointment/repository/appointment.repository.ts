import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  Appointment as PrismaAppointment,
  Prisma,
} from '@/generated/prisma-client';
import { AppointmentModel } from '../models/appointment.model';
import { AppointmentMapper } from '../mappers/appointment.mapper';

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
  ): Promise<AppointmentModel[]> {
    const mergedWhere: Prisma.AppointmentWhereInput = {
      ...baseWhere,
      ...filters,
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
  >): Promise<IPaginationOffsetReturn<AppointmentModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaAppointment>(
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
    const paginatedResult = await this.paginationService.cursor<PrismaAppointment>(
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

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => AppointmentMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<AppointmentModel | null> {
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

  async findOne(
    where: Prisma.AppointmentWhereInput
  ): Promise<AppointmentModel | null> {
    const result = await this.databaseService.appointment.findFirst({
      where,
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
      where: { id },
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

  async delete(id: string): Promise<AppointmentModel> {
    const result = await this.databaseService.appointment.delete({
      where: { id },
      include: {
        user: true,
        userVehicle: true,
        vehicleModel: true,
        vehicleServices: true,
      },
    });

    return AppointmentMapper.toDomain(result);
  }
}
