import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from '../repository/appointment.repository';
import { IAppointmentService } from '../interfaces/appointment.service.interface';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { EnumAppointmentStatus } from '../enums/appointment.enum';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { AppointmentBookRequestDto } from '../dtos/request/appointment.book.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { EnumAppointmentStatusCodeError } from '../enums/appointment.status-code.enum';
import { EnumVehicleModelStatusCodeError } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { EnumUserVehicleStatusCodeError } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';
import { EnumVehicleServiceStatusCodeError } from '@/modules/vehicle-service/enums/vehicle-service.status-code.enum';
import { Appointment, Prisma } from '@/generated/prisma-client';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly vehicleModelService: VehicleModelService,
    private readonly userVehicleService: UserVehicleService,
    private readonly vehicleServiceService: VehicleServiceService
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<Appointment>> {
    const { data, ...others } =
      await this.appointmentRepository.findWithPaginationOffset(pagination);

    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<Appointment>> {
    const { data, ...others } =
      await this.appointmentRepository.findWithPaginationCursor(pagination);

    return { data, ...others };
  }

  async findOneById(id: string): Promise<Appointment> {
    return this.findOneByIdOrFail(id);
  }

  async findOneWithRelationsById(id: string): Promise<Appointment> {
    const appointment = await this.findOneByIdOrFail(id);
    return appointment;
  }

  async findOne(find: Record<string, any>): Promise<Appointment | null> {
    return this.appointmentRepository.findOne(find);
  }

  async findOneWithRelations(
    find: Record<string, any>
  ): Promise<Appointment | null> {
    return this.appointmentRepository.findOne(find);
  }

  // User book an appointment
  async createAppointment({
    name,
    phone,
    vehicleModel,
    vehicleServices,
    licensePlateNumber,
    appointmentDate,
    address,
    note,
  }: AppointmentBookRequestDto): Promise<Appointment> {
    // Validate vehicleModel
    const foundVehicleModel =
      await this.vehicleModelService.findOneById(vehicleModel);
    if (!foundVehicleModel) {
      throw new NotFoundException({
        statusCode: EnumVehicleModelStatusCodeError.notFound,
        message: 'vehicle-model.error.notFound',
      });
    }

    // Validate vehicleServices
    await Promise.all(
      vehicleServices.map(async id => {
        const service = await this.vehicleServiceService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: EnumVehicleServiceStatusCodeError.notFound,
            message: 'vehicle-service.error.notFound',
          });
        }
      })
    );

    const data: Prisma.AppointmentCreateInput = {
      name,
      phone,
      vehicleModel: { connect: { id: vehicleModel } },
      vehicleServices: { connect: vehicleServices.map(id => ({ id })) },
      licensePlateNumber,
      appointmentDate: new Date(appointmentDate),
      address,
      note: note ?? '',
      status: EnumAppointmentStatus.pending,
    };

    return this.appointmentRepository.create(data);
  }

  // Admin create an appointment
  async create({
    user,
    userVehicle,
    name,
    phone,
    vehicleModel,
    vehicleServices,
    licensePlateNumber,
    appointmentDate,
    customerRequests,
    address,
    note,
    status,
  }: AppointmentCreateRequestDto): Promise<{ _id: string }> {
    // Validate vehicleModel
    const foundVehicleModel =
      await this.vehicleModelService.findOneById(vehicleModel);
    if (!foundVehicleModel) {
      throw new NotFoundException({
        statusCode: EnumVehicleModelStatusCodeError.notFound,
        message: 'vehicle-model.error.notFound',
      });
    }

    // Validate userVehicle if provided
    if (userVehicle) {
      const foundUserVehicle =
        await this.userVehicleService.findOneById(userVehicle);
      if (!foundUserVehicle) {
        throw new NotFoundException({
          statusCode: EnumUserVehicleStatusCodeError.notFound,
          message: 'user-vehicle.error.notFound',
        });
      }
    }

    // Validate vehicleServices
    await Promise.all(
      vehicleServices.map(async id => {
        const service = await this.vehicleServiceService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: EnumVehicleServiceStatusCodeError.notFound,
            message: 'vehicle-service.error.notFound',
          });
        }
      })
    );

    const data: Prisma.AppointmentCreateInput = {
      user: user ? { connect: { id: user } } : undefined,
      userVehicle: userVehicle ? { connect: { id: userVehicle } } : undefined,
      name,
      phone,
      vehicleModel: { connect: { id: vehicleModel } },
      vehicleServices: { connect: vehicleServices.map(id => ({ id })) },
      licensePlateNumber,
      customerRequests: customerRequests ?? [],
      appointmentDate: new Date(appointmentDate),
      address,
      note: note ?? '',
      status: status ?? EnumAppointmentStatus.pending,
    };

    const created = await this.appointmentRepository.create(data);
    return { _id: created.id };
  }

  async update(
    id: string,
    {
      user,
      userVehicle,
      name,
      phone,
      vehicleModel,
      vehicleServices,
      licensePlateNumber,
      customerRequests,
      appointmentDate,
      address,
      note,
      status,
    }: AppointmentUpdateRequestDto
  ): Promise<void> {
    // Find appointment
    const appointment = await this.findOneByIdOrFail(id);

    // Validate userVehicle if provided
    if (userVehicle) {
      const foundUserVehicle =
        await this.userVehicleService.findOneById(userVehicle);
      if (!foundUserVehicle) {
        throw new NotFoundException({
          statusCode: EnumUserVehicleStatusCodeError.notFound,
          message: 'user-vehicle.error.notFound',
        });
      }
    }

    // Validate vehicleModel if provided
    if (vehicleModel) {
      const foundVehicleModel =
        await this.vehicleModelService.findOneById(vehicleModel);
      if (!foundVehicleModel) {
        throw new NotFoundException({
          statusCode: EnumVehicleModelStatusCodeError.notFound,
          message: 'vehicle-model.error.notFound',
        });
      }
    }

    // Validate vehicleServices if provided
    if (vehicleServices?.length) {
      await Promise.all(
        vehicleServices.map(async serviceId => {
          const service =
            await this.vehicleServiceService.findOneById(serviceId);
          if (!service) {
            throw new NotFoundException({
              statusCode: EnumVehicleServiceStatusCodeError.notFound,
              message: 'vehicle-service.error.notFound',
            });
          }
        })
      );
    }

    const data: Prisma.AppointmentUpdateInput = {
      user: user ? { connect: { id: user } } : undefined,
      userVehicle: userVehicle ? { connect: { id: userVehicle } } : undefined,
      name: name ?? undefined,
      phone: phone ?? undefined,
      vehicleModel: vehicleModel
        ? { connect: { id: vehicleModel } }
        : undefined,
      vehicleServices: vehicleServices
        ? { connect: vehicleServices.map(id => ({ id })) }
        : undefined,
      licensePlateNumber: licensePlateNumber ?? undefined,
      customerRequests: customerRequests ?? undefined,
      appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
      address: address ?? undefined,
      note: note ?? undefined,
      status: status ?? undefined,
    };

    await this.appointmentRepository.update(id, data);
  }

  async updateStatus(
    id: string,
    { status }: AppointmentUpdateStatusRequestDto
  ): Promise<void> {
    await this.appointmentRepository.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await this.appointmentRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    // Soft delete not implemented in Prisma version
    await this.appointmentRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOneById(id);
    if (!appointment) {
      throw new NotFoundException({
        statusCode: EnumAppointmentStatusCodeError.notFound,
        message: 'appointment.error.notFound',
      });
    }
    return appointment;
  }
}
