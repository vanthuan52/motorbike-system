import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { MaintenanceScheduleRepository } from '../repository/maintenance-schedule.repository';
import { IMaintenanceScheduleService } from '../interfaces/maintenance-schedule.service.interface';
import {
  MaintenanceScheduleDoc,
  MaintenanceScheduleEntity,
} from '../entities/maintenance-schedule.entity';
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
import { MaintenanceScheduleCreateRequestDto } from '../dtos/request/maintenance-schedule.create.request.dto';
import { MaintenanceScheduleUpdateRequestDto } from '../dtos/request/maintenance-schedule.update.request.dto';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../enums/maintenance-schedule.enum';
import { MaintenanceScheduleListResponseDto } from '../dtos/response/maintenance-schedule.list.response.dto';
import { MaintenanceScheduleUpdateStatusRequestDto } from '../dtos/request/maintenance-schedule.update-status.request.dto';
import {
  IMaintenanceScheduleDoc,
  IMaintenanceScheduleEntity,
} from '../interfaces/maintenance-schedule.interface';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ServiceCategoryTableName } from '@/modules/service-category/entities/service-category.entity';
import { MaintenanceScheduleGetFullResponseDto } from '../dtos/response/maintenance-schedule.full.response.dto';
import { MaintenanceScheduleGetResponseDto } from '../dtos/response/maintenance-schedule.get.response.dto';

@Injectable()
export class MaintenanceScheduleService implements IMaintenanceScheduleService {
  constructor(
    private readonly MaintenanceScheduleRepository: MaintenanceScheduleRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const MaintenanceSchedule =
      await this.MaintenanceScheduleRepository.findOne({ name }, options);
    return !!MaintenanceSchedule;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const MaintenanceSchedule =
      await this.MaintenanceScheduleRepository.findOne({ slug }, options);
    return !!MaintenanceSchedule;
  }

  mapList(
    MaintenanceSchedule:
      | MaintenanceScheduleDoc[]
      | IMaintenanceScheduleEntity[],
  ): MaintenanceScheduleListResponseDto[] {
    return plainToInstance(
      MaintenanceScheduleListResponseDto,
      MaintenanceSchedule.map(
        (p: MaintenanceScheduleDoc | IMaintenanceScheduleEntity) =>
          typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    MaintenanceSchedule: MaintenanceScheduleDoc | IMaintenanceScheduleEntity,
  ): MaintenanceScheduleGetResponseDto {
    return plainToInstance(
      MaintenanceScheduleGetResponseDto,
      typeof (MaintenanceSchedule as any).toObject === 'function'
        ? (MaintenanceSchedule as any).toObject()
        : MaintenanceSchedule,
    );
  }

  mapGetPopulate(
    MaintenanceSchedule: MaintenanceScheduleDoc | IMaintenanceScheduleEntity,
  ): MaintenanceScheduleGetFullResponseDto {
    return plainToInstance(
      MaintenanceScheduleGetFullResponseDto,
      typeof (MaintenanceSchedule as any).toObject === 'function'
        ? (MaintenanceSchedule as any).toObject()
        : MaintenanceSchedule,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MaintenanceScheduleDoc[]> {
    return this.MaintenanceScheduleRepository.findAll<MaintenanceScheduleDoc>(
      find,
      options,
    );
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MaintenanceScheduleDoc[]> {
    return this.MaintenanceScheduleRepository.findAll<MaintenanceScheduleDoc>(
      find,
      options,
    );
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
  ): Promise<IMaintenanceScheduleEntity[]> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithServiceCategory(find);

    return this.MaintenanceScheduleRepository.findAllAggregate<IMaintenanceScheduleEntity>(
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

    return this.MaintenanceScheduleRepository.getTotalAggregate(
      pipeline,
      options,
    );
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<MaintenanceScheduleDoc | null> {
    return this.MaintenanceScheduleRepository.findOneById<MaintenanceScheduleDoc>(
      _id,
      options,
    );
  }

  async findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IMaintenanceScheduleDoc | null> {
    return this.MaintenanceScheduleRepository.findOneById<IMaintenanceScheduleDoc>(
      _id,
      {
        ...options,
        join: true,
      },
    );
  }

  async join(
    repository: MaintenanceScheduleDoc,
  ): Promise<IMaintenanceScheduleDoc> {
    return this.MaintenanceScheduleRepository.join(
      repository,
      this.MaintenanceScheduleRepository._join!,
    );
  }

  async joinVehicleBrand(
    repository: MaintenanceScheduleDoc,
  ): Promise<IMaintenanceScheduleDoc> {
    return this.MaintenanceScheduleRepository.join(
      repository,
      this.MaintenanceScheduleRepository._joinVehicleBrand!,
    );
  }

  async joinVehicleModel(
    repository: MaintenanceScheduleDoc,
  ): Promise<IMaintenanceScheduleDoc> {
    return this.MaintenanceScheduleRepository.join(
      repository,
      this.MaintenanceScheduleRepository._joinVehicleModel!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<MaintenanceScheduleDoc | null> {
    return this.MaintenanceScheduleRepository.findOne<MaintenanceScheduleDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.MaintenanceScheduleRepository.getTotal(find, options);
  }

  async create(
    {
      customer,
      phone,
      vehicleBrand,
      vehicleModel,
      serviceCategory,
      staff,
      vehicleNumber,
      address,
      scheduleDate,
      timeSlot,
      note,
      status,
    }: MaintenanceScheduleCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<MaintenanceScheduleDoc> {
    const create: MaintenanceScheduleEntity = new MaintenanceScheduleEntity();

    create.customer = customer;
    create.phone = phone;
    create.vehicleBrand = vehicleBrand;
    create.vehicleModel = vehicleModel;
    create.staff = staff;
    create.vehicleNumber = vehicleNumber;
    create.address = address;
    create.scheduleDate = new Date(scheduleDate);
    create.timeSlot = timeSlot;
    create.note = note ?? '';
    create.serviceCategory = serviceCategory;
    create.status = ENUM_MAINTENANCE_SCHEDULE_STATUS.PENDING;

    return this.MaintenanceScheduleRepository.create<MaintenanceScheduleEntity>(
      create,
      options,
    );
  }

  async update(
    repository: MaintenanceScheduleDoc,
    {
      customer,
      phone,
      vehicleBrand,
      vehicleModel,
      serviceCategory,
      staff,
      vehicleNumber,
      address,
      scheduleDate,
      timeSlot,
      note,
      status,
    }: MaintenanceScheduleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MaintenanceScheduleDoc> {
    repository.customer = customer ?? repository.customer;
    repository.phone = phone ?? repository.phone;
    repository.vehicleBrand = vehicleBrand ?? repository.vehicleBrand;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.staff = staff ?? repository.staff;
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

    return this.MaintenanceScheduleRepository.save(repository, options);
  }

  async softDelete(
    repository: MaintenanceScheduleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<MaintenanceScheduleDoc> {
    return this.MaintenanceScheduleRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.MaintenanceScheduleRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: MaintenanceScheduleDoc,
    { status }: MaintenanceScheduleUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MaintenanceScheduleDoc> {
    repository.status = status;

    return this.MaintenanceScheduleRepository.save(repository, options);
  }
}
