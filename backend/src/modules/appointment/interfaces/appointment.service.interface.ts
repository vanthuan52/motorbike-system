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
import { AppointmentsDoc } from '../entities/appointment.entity';
import { AppointmentsCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentsUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentsGetResponseDto } from '../dtos/response/appointment.get.response.dto';
import { AppointmentsListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { IAppointmentsDoc, IAppointmentsEntity } from './appointment.interface';

export interface IAppointmentsService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AppointmentsDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AppointmentsDoc[]>;

  createRawQueryFindAllWithServiceCategory(
    find?: Record<string, any>,
  ): PipelineStage[];

  findAllWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IAppointmentsEntity[]>;

  getTotalWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<AppointmentsDoc | null>;

  findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IAppointmentsDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentsDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: AppointmentsCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<AppointmentsDoc>;

  update(
    repository: AppointmentsDoc,
    payload: AppointmentsUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentsDoc>;

  softDelete(
    repository: AppointmentsDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentsDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: AppointmentsDoc[]): AppointmentsListResponseDto[];
  mapGet(data: AppointmentsDoc): AppointmentsGetResponseDto;
}
