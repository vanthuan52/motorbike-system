import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, PipelineStage } from 'mongoose';
import { AppointmentRepository } from '../repository/appointment.repository';
import { IAppointmentService } from '../interfaces/appointment.service.interface';
import {
  AppointmentDoc,
  AppointmentEntity,
} from '../entities/appointment.entity';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import {
  IAppointmentDoc,
  IAppointmentEntity,
} from '../interfaces/appointment.interface';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { VehicleServiceTableName } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { AppointmentGetResponseDto } from '../dtos/response/appointment.get.response.dto';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AppointmentDoc[]> {
    return this.appointmentRepository.findAll<AppointmentDoc>(find, options);
  }

  createRawQueryFindAllWithVehicleService(
    find?: Record<string, any>,
  ): PipelineStage[] {
    return [
      {
        $lookup: {
          from: VehicleServiceTableName,
          as: 'vehicleService',
          foreignField: '_id',
          localField: 'vehicleService',
        },
      },
      {
        $unwind: '$VehicleService',
      },
      {
        $match: find as FilterQuery<any>,
      },
    ];
  }

  async findAllWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IAppointmentEntity[]> {
    return this.appointmentRepository.findAll<IAppointmentEntity>(find, {
      ...options,
      join: this.appointmentRepository._joinVehicleModel,
    });
  }

  async getTotalWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.appointmentRepository.getTotal(find, {
      ...options,
      join: this.appointmentRepository._joinVehicleModel,
    });
  }

  async findAllWithVehicleService(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IAppointmentEntity[]> {
    return this.appointmentRepository.findAll<IAppointmentEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithVehicleService(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.appointmentRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc | null> {
    return this.appointmentRepository.findOneById<AppointmentDoc>(_id, options);
  }

  async findOneWithVehicleServiceById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IAppointmentDoc | null> {
    return this.appointmentRepository.findOneById<IAppointmentDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async join(repository: AppointmentDoc): Promise<IAppointmentDoc> {
    return this.appointmentRepository.join(
      repository,
      this.appointmentRepository._joinActive,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc | null> {
    return this.appointmentRepository.findOne<AppointmentDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.appointmentRepository.getTotal(find, options);
  }

  async create(
    {
      user,
      userVehicle,
      name,
      phone,
      vehicleModel,
      vehicleServices,
      licensePlate,
      appointmentDate,
      address,
      note,
      status,
    }: AppointmentCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<AppointmentDoc> {
    const create: AppointmentEntity = new AppointmentEntity();

    create.user = user;
    create.userVehicle = userVehicle;
    create.name = name;
    create.phone = phone;
    create.vehicleModel = vehicleModel;
    create.vehicleServices = vehicleServices;
    create.licensePlate = licensePlate;
    create.appointmentDate = new Date(appointmentDate);
    create.address = address;
    create.note = note ?? '';
    create.status = status ?? ENUM_APPOINTMENT_STATUS.PENDING;

    return this.appointmentRepository.create<AppointmentEntity>(
      create,
      options,
    );
  }

  async update(
    repository: AppointmentDoc,
    {
      user,
      userVehicle,
      name,
      phone,
      vehicleModel,
      vehicleServices,
      licensePlate,
      appointmentDate,
      address,
      note,
      status,
    }: AppointmentUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentDoc> {
    repository.user = user ?? repository.user;
    repository.userVehicle = userVehicle ?? repository.userVehicle;
    repository.name = name ?? repository.name;
    repository.phone = phone ?? repository.phone;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.vehicleServices = vehicleServices ?? repository.vehicleServices;
    repository.licensePlate = licensePlate ?? repository.licensePlate;
    repository.appointmentDate =
      appointmentDate !== undefined
        ? new Date(appointmentDate)
        : repository.appointmentDate;
    repository.address = address ?? repository.address;
    repository.note = note ?? repository.note;
    repository.status = status ?? repository.status;

    return this.appointmentRepository.save(repository, options);
  }

  async softDelete(
    repository: AppointmentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentDoc> {
    return this.appointmentRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.appointmentRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: AppointmentDoc,
    { status }: AppointmentUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentDoc> {
    repository.status = status;

    return this.appointmentRepository.save(repository, options);
  }

  mapList(
    appointment: AppointmentDoc[] | IAppointmentEntity[],
  ): AppointmentListResponseDto[] {
    return plainToInstance(
      AppointmentListResponseDto,
      appointment.map((p: AppointmentDoc | IAppointmentEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    appointment: IAppointmentDoc | IAppointmentEntity,
  ): AppointmentGetResponseDto {
    return plainToInstance(
      AppointmentGetResponseDto,
      typeof (appointment as any).toObject === 'function'
        ? (appointment as any).toObject()
        : appointment,
    );
  }

  mapGetPopulate(
    appointment: AppointmentDoc | IAppointmentEntity,
  ): AppointmentGetFullResponseDto {
    return plainToInstance(
      AppointmentGetFullResponseDto,
      typeof (appointment as any).toObject === 'function'
        ? (appointment as any).toObject()
        : appointment,
    );
  }
}
