import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IAppointmentService } from '../interfaces/appointment.service.interface';
import { AppointmentRepository } from '../repository/appointment.repository';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { AppointmentModel } from '../models/appointment.model';
import {
  IPaginationOffsetReturn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumAppointmentStatus } from '../enums/appointment.enum';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { EnumVehicleModelStatusCodeError } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { EnumUserVehicleStatusCodeError } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';
import { EnumVehicleServiceStatusCodeError } from '@/modules/vehicle-service/enums/vehicle-service.status-code.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { AppointmentUtil } from '../utils/appointment.util';
import { EnumAppointmentStatusCodeError } from '../enums/appointment.status-code.enum';
import { Prisma } from '@/generated/prisma-client';
import { IAppointmentListFilters } from '../interfaces/appointment.filter.interface';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly vehicleModelService: VehicleModelService,
    private readonly userVehicleService: UserVehicleService,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly appointmentUtil: AppointmentUtil
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: IAppointmentListFilters
  ): Promise<IPaginationOffsetReturn<AppointmentModel>> {
    const { data, ...others } =
      await this.appointmentRepository.findWithPaginationOffset(
        pagination,
        filters
      );
    return {
      data,
      ...others,
    };
  }

  async findOneById(id: string): Promise<AppointmentModel> {
    const appointment = await this.appointmentRepository.findOneById(id);
    if (!appointment) {
      throw new NotFoundException({
        statusCode: EnumAppointmentStatusCodeError.notFound,
        message: 'appointment.error.notFound',
      });
    }
    return appointment;
  }

  async findOneByIdOrFail(id: string): Promise<AppointmentModel> {
    return this.findOneById(id);
  }

  // Admin create an appointment
  async create(
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
    }: AppointmentCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel> {
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
      createdBy: actionBy,
    };

    const created = await this.appointmentRepository.create(data);
    return created;
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
    }: AppointmentUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel> {
    // Find appointment
    await this.findOneByIdOrFail(id);

    // Validate vehicleModel
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
    if (vehicleServices) {
      await Promise.all(
        vehicleServices.map(async svId => {
          const service = await this.vehicleServiceService.findOneById(svId);
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
      name,
      phone,
      vehicleModel: vehicleModel
        ? { connect: { id: vehicleModel } }
        : undefined,
      vehicleServices: vehicleServices
        ? { set: vehicleServices.map(svId => ({ id: svId })) }
        : undefined,
      licensePlateNumber,
      customerRequests,
      appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
      address,
      note,
      updatedBy: actionBy,
    };

    const updated = await this.appointmentRepository.update(id, data);
    return updated;
  }

  async updateStatus(
    id: string,
    { status }: AppointmentUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel> {
    await this.findOneByIdOrFail(id);
    const updated = await this.appointmentRepository.update(id, {
      status,
      updatedBy: actionBy,
    });
    return updated;
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel> {
    await this.findOneByIdOrFail(id);
    const deleted = await this.appointmentRepository.softDelete(id, actionBy);
    return deleted;
  }

  // === Trash/Restore ===

  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: IAppointmentListFilters
  ): Promise<IPaginationOffsetReturn<AppointmentModel>> {
    const { data, ...others } =
      await this.appointmentRepository.findWithPaginationOffsetTrashed(
        pagination,
        filters
      );
    return {
      data,
      ...others,
    };
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<AppointmentModel> {
    const appointment =
      await this.appointmentRepository.findOneByIdIncludeDeleted(id);
    if (!appointment) {
      throw new NotFoundException({
        statusCode: EnumAppointmentStatusCodeError.notFound,
        message: 'appointment.error.notFound',
      });
    }

    if (!appointment.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumAppointmentStatusCodeError.notInTrash,
        message: 'appointment.error.notInTrash',
      });
    }

    const updated = await this.appointmentRepository.restore(id, restoredBy);
    return updated;
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<AppointmentModel> {
    const appointment =
      await this.appointmentRepository.findOneByIdIncludeDeleted(id);
    if (!appointment) {
      throw new NotFoundException({
        statusCode: EnumAppointmentStatusCodeError.notFound,
        message: 'appointment.error.notFound',
      });
    }

    if (!appointment.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumAppointmentStatusCodeError.notInTrash,
        message: 'appointment.error.notInTrash',
      });
    }

    const deleted = await this.appointmentRepository.forceDelete(id);
    return deleted;
  }
}
