import { PipelineStage } from 'mongoose';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { MaintenanceScheduleDoc } from '../entities/maintenance-schedule.entity';
import { MaintenanceScheduleCreateRequestDto } from '../dtos/request/maintenance-schedule.create.request.dto';
import { MaintenanceScheduleUpdateRequestDto } from '../dtos/request/maintenance-schedule.update.request.dto';
import { MaintenanceScheduleGetResponseDto } from '../dtos/response/maintenance-schedule.get.response.dto';
import { MaintenanceScheduleListResponseDto } from '../dtos/response/maintenance-schedule.list.response.dto';
import {
  IMaintenanceScheduleDoc,
  IMaintenanceScheduleEntity,
} from './maintenance-schedule.interface';

export interface IMaintenanceScheduleService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MaintenanceScheduleDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MaintenanceScheduleDoc[]>;

  createRawQueryFindAllWithServiceCategory(
    find?: Record<string, any>,
  ): PipelineStage[];

  findAllWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IMaintenanceScheduleEntity[]>;

  getTotalWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<MaintenanceScheduleDoc | null>;

  findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IMaintenanceScheduleDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<MaintenanceScheduleDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: MaintenanceScheduleCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<MaintenanceScheduleDoc>;

  update(
    repository: MaintenanceScheduleDoc,
    payload: MaintenanceScheduleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MaintenanceScheduleDoc>;

  softDelete(
    repository: MaintenanceScheduleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<MaintenanceScheduleDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: MaintenanceScheduleDoc[]): MaintenanceScheduleListResponseDto[];
  mapGet(data: MaintenanceScheduleDoc): MaintenanceScheduleGetResponseDto;
}
