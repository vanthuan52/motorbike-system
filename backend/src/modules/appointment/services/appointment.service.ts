import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from '../repository/appointment.repository';
import { IAppointmentService } from '../interfaces/appointment.service.interface';
import {
  AppointmentDoc,
  AppointmentEntity,
} from '../entities/appointment.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { IAppointmentEntity } from '../interfaces/appointment.interface';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentBookRequestDto } from '../dtos/request/appointment.book.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { ENUM_APPOINTMENT_STATUS_CODE_ERROR } from '../enums/appointment.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '@/modules/vehicle-service/enums/vehicle-service.status-code.enum';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly vehicleModelService: VehicleModelService,
    private readonly userVehicleService: UserVehicleService,
    private readonly vehicleServiceService: VehicleServiceService,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: AppointmentDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [appointments, total] = await Promise.all([
      this.appointmentRepository.findAll<AppointmentDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: this.appointmentRepository._joinVehicleModel,
      }),
      this.appointmentRepository.getTotal(find, {
        join: this.appointmentRepository._joinVehicleModel,
      }),
    ]);

    return {
      data: appointments,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: AppointmentDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.appointmentRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: this.appointmentRepository._joinVehicleModel,
      }),
      includeCount
        ? this.appointmentRepository.getTotal(find, {
            join: this.appointmentRepository._joinVehicleModel,
          })
        : Promise.resolve(undefined),
    ]);

    return { data, total: count };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc> {
    const appointment = await this.findOneByIdOrFail(id, options);
    return appointment;
  }

  async findOneWithRelationsById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc> {
    const appointment = await this.findOneByIdOrFail(id, {
      ...options,
      join: true,
    });
    return appointment;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc> {
    const appointment =
      await this.appointmentRepository.findOne<AppointmentDoc>(find, options);
    return appointment;
  }

  async findOneWithRelations(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc> {
    const appointment =
      await this.appointmentRepository.findOne<AppointmentDoc>(find, {
        ...options,
        join: true,
      });
    return appointment;
  }

  // User book an appointment
  async createAppointment(
    {
      name,
      phone,
      vehicleModel,
      vehicleServices,
      licensePlateNumber,
      appointmentDate,
      address,
      note,
    }: AppointmentBookRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<AppointmentDoc> {
    const foundVehicleModel =
      await this.vehicleModelService.findOneById(vehicleModel);
    if (!foundVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    await Promise.all(
      vehicleServices.map(async (id) => {
        const service = await this.vehicleServiceService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
            message: 'vehicle-service.error.notFound',
          });
        }
      }),
    );

    const create: AppointmentEntity = new AppointmentEntity();

    create.name = name;
    create.phone = phone;
    create.vehicleModel = vehicleModel;
    create.vehicleServices = vehicleServices;
    create.licensePlateNumber = licensePlateNumber;
    create.appointmentDate = new Date(appointmentDate);
    create.address = address;
    create.note = note ?? '';
    create.status = ENUM_APPOINTMENT_STATUS.PENDING;

    return this.appointmentRepository.create<AppointmentEntity>(
      create,
      options,
    );
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
      appointmentDate,
      customerRequests,
      address,
      note,
      status,
    }: AppointmentCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto> {
    // Validate vehicleModel
    const foundVehicleModel =
      await this.vehicleModelService.findOneById(vehicleModel);
    if (!foundVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    // Validate userVehicle if provided
    if (userVehicle) {
      const foundUserVehicle =
        await this.userVehicleService.findOneById(userVehicle);
      if (!foundUserVehicle) {
        throw new NotFoundException({
          statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'user-vehicle.error.notFound',
        });
      }
    }

    // Validate vehicleServices
    await Promise.all(
      vehicleServices.map(async (id) => {
        const service = await this.vehicleServiceService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
            message: 'vehicle-service.error.notFound',
          });
        }
      }),
    );

    // Create entity
    const create: AppointmentEntity = new AppointmentEntity();
    create.user = user;
    create.userVehicle = userVehicle;
    create.name = name;
    create.phone = phone;
    create.vehicleModel = vehicleModel;
    create.vehicleServices = vehicleServices;
    create.licensePlateNumber = licensePlateNumber;
    create.customerRequests = customerRequests;
    create.appointmentDate = new Date(appointmentDate);
    create.address = address;
    create.note = note ?? '';
    create.status = status ?? ENUM_APPOINTMENT_STATUS.PENDING;

    const created = await this.appointmentRepository.create<AppointmentEntity>(
      create,
      options,
    );

    return { _id: created._id };
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
    }: AppointmentUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    // Find appointment
    const repository = await this.findOneByIdOrFail(id);

    // Validate userVehicle if provided
    if (userVehicle) {
      const foundUserVehicle =
        await this.userVehicleService.findOneById(userVehicle);
      if (!foundUserVehicle) {
        throw new NotFoundException({
          statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
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
          statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'vehicle-model.error.notFound',
        });
      }
    }

    // Validate vehicleServices if provided
    if (vehicleServices?.length) {
      await Promise.all(
        vehicleServices.map(async (serviceId) => {
          const service =
            await this.vehicleServiceService.findOneById(serviceId);
          if (!service) {
            throw new NotFoundException({
              statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
              message: 'vehicle-service.error.notFound',
            });
          }
        }),
      );
    }

    // Update fields
    repository.user = user ?? repository.user;
    repository.userVehicle = userVehicle ?? repository.userVehicle;
    repository.name = name ?? repository.name;
    repository.phone = phone ?? repository.phone;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.vehicleServices = vehicleServices ?? repository.vehicleServices;
    repository.licensePlateNumber =
      licensePlateNumber ?? repository.licensePlateNumber;
    repository.customerRequests =
      customerRequests ?? repository.customerRequests;
    repository.appointmentDate =
      appointmentDate !== undefined
        ? new Date(appointmentDate)
        : repository.appointmentDate;
    repository.address = address ?? repository.address;
    repository.note = note ?? repository.note;
    repository.status = status ?? repository.status;

    await this.appointmentRepository.save(repository, options);
  }

  async updateStatus(
    id: string,
    { status }: AppointmentUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const appointment = await this.findOneByIdOrFail(id);
    appointment.status = status;

    await this.appointmentRepository.save(appointment, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    await this.appointmentRepository.delete({ _id: id }, options);
  }

  async softDelete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const appointment = await this.findOneByIdOrFail(id);
    await this.appointmentRepository.softDelete(appointment, options);
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc> {
    const appointment =
      await this.appointmentRepository.findOneById<AppointmentDoc>(id, options);
    if (!appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }
    return appointment;
  }
}
