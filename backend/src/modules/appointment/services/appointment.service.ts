import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { AppointmentsRepository } from '../repository/appointment.repository';
import { IAppointmentsService } from '../interfaces/appointment.service.interface';
import {
  AppointmentsDoc,
  AppointmentsEntity,
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
import { AppointmentsCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentsUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { ENUM_APPOINTMENTS_STATUS } from '../enums/appointment.enum';
import { AppointmentsListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentsUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import {
  IAppointmentsDoc,
  IAppointmentsEntity,
} from '../interfaces/appointment.interface';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ServiceCategoryTableName } from '@/modules/service-category/entities/service-category.entity';
import { AppointmentsGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { AppointmentsGetResponseDto } from '../dtos/response/appointment.get.response.dto';

@Injectable()
export class AppointmentsService implements IAppointmentsService {
  constructor(
    private readonly AppointmentsRepository: AppointmentsRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const Appointment = await this.AppointmentsRepository.findOne(
      { name },
      options,
    );
    return !!Appointment;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const Appointment = await this.AppointmentsRepository.findOne(
      { slug },
      options,
    );
    return !!Appointment;
  }

  mapList(
    Appointment: AppointmentsDoc[] | IAppointmentsEntity[],
  ): AppointmentsListResponseDto[] {
    return plainToInstance(
      AppointmentsListResponseDto,
      Appointment.map((p: AppointmentsDoc | IAppointmentsEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    Appointment: AppointmentsDoc | IAppointmentsEntity,
  ): AppointmentsGetResponseDto {
    return plainToInstance(
      AppointmentsGetResponseDto,
      typeof (Appointment as any).toObject === 'function'
        ? (Appointment as any).toObject()
        : Appointment,
    );
  }

  mapGetPopulate(
    Appointment: AppointmentsDoc | IAppointmentsEntity,
  ): AppointmentsGetFullResponseDto {
    return plainToInstance(
      AppointmentsGetFullResponseDto,
      typeof (Appointment as any).toObject === 'function'
        ? (Appointment as any).toObject()
        : Appointment,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AppointmentsDoc[]> {
    return this.AppointmentsRepository.findAll<AppointmentsDoc>(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AppointmentsDoc[]> {
    return this.AppointmentsRepository.findAll<AppointmentsDoc>(find, options);
  }

  createRawQueryFindAllWithServiceCategory(
    find?: Record<string, any>,
  ): PipelineStage[] {
    return [
      {
        $lookup: {
          from: ServiceCategoryTableName,
          as: 'serviceCategory',
          foreignField: '_id',
          localField: 'serviceCategory',
        },
      },
      {
        $unwind: '$serviceCategory',
      },
      {
        $match: find as FilterQuery<any>,
      },
    ];
  }

  async findAllWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IAppointmentsEntity[]> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithServiceCategory(find);

    return this.AppointmentsRepository.findAllAggregate<IAppointmentsEntity>(
      pipeline,
      options,
    );
  }

  async getTotalWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithServiceCategory(find);

    return this.AppointmentsRepository.getTotalAggregate(pipeline, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentsDoc | null> {
    return this.AppointmentsRepository.findOneById<AppointmentsDoc>(
      _id,
      options,
    );
  }

  async findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IAppointmentsDoc | null> {
    return this.AppointmentsRepository.findOneById<IAppointmentsDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async join(repository: AppointmentsDoc): Promise<IAppointmentsDoc> {
    return this.AppointmentsRepository.join(
      repository,
      this.AppointmentsRepository._join!,
    );
  }

  async joinVehicleBrand(
    repository: AppointmentsDoc,
  ): Promise<IAppointmentsDoc> {
    return this.AppointmentsRepository.join(
      repository,
      this.AppointmentsRepository._joinVehicleBrand!,
    );
  }

  async joinVehicleModel(
    repository: AppointmentsDoc,
  ): Promise<IAppointmentsDoc> {
    return this.AppointmentsRepository.join(
      repository,
      this.AppointmentsRepository._joinVehicleModel!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentsDoc | null> {
    return this.AppointmentsRepository.findOne<AppointmentsDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.AppointmentsRepository.getTotal(find, options);
  }

  async create(
    {
      customer,
      phone,
      vehicleBrand,
      vehicleModel,
      serviceCategory,
      vehicleNumber,
      address,
      scheduleDate,
      timeSlot,
      note,
      status,
    }: AppointmentsCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<AppointmentsDoc> {
    const create: AppointmentsEntity = new AppointmentsEntity();

    create.customer = customer;
    create.phone = phone;
    create.vehicleBrand = vehicleBrand;
    create.vehicleModel = vehicleModel;
    create.vehicleNumber = vehicleNumber;
    create.address = address;
    create.scheduleDate = new Date(scheduleDate);
    create.timeSlot = timeSlot;
    create.note = note ?? '';
    create.serviceCategory = serviceCategory;
    create.status = ENUM_APPOINTMENTS_STATUS.PENDING;

    return this.AppointmentsRepository.create<AppointmentsEntity>(
      create,
      options,
    );
  }

  async update(
    repository: AppointmentsDoc,
    {
      customer,
      phone,
      vehicleBrand,
      vehicleModel,
      serviceCategory,
      vehicleNumber,
      address,
      scheduleDate,
      timeSlot,
      note,
      status,
    }: AppointmentsUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentsDoc> {
    repository.customer = customer ?? repository.customer;
    repository.phone = phone ?? repository.phone;
    repository.vehicleBrand = vehicleBrand ?? repository.vehicleBrand;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.vehicleNumber = vehicleNumber ?? repository.vehicleNumber;
    repository.address = address ?? repository.address;
    repository.scheduleDate =
      scheduleDate !== undefined
        ? typeof scheduleDate === 'string'
          ? new Date(scheduleDate)
          : scheduleDate
        : repository.scheduleDate;
    repository.timeSlot = timeSlot ?? repository.timeSlot;
    repository.note = note ?? repository.note;
    repository.status = status ?? repository.status;
    repository.serviceCategory = serviceCategory ?? repository.serviceCategory;

    return this.AppointmentsRepository.save(repository, options);
  }

  async softDelete(
    repository: AppointmentsDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentsDoc> {
    return this.AppointmentsRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.AppointmentsRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: AppointmentsDoc,
    { status }: AppointmentsUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentsDoc> {
    repository.status = status;

    return this.AppointmentsRepository.save(repository, options);
  }
}
