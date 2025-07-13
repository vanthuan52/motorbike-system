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
import { AppointmentDoc } from '../entities/appointment.entity';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentGetResponseDto } from '../dtos/response/appointment.get.response.dto';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { IAppointmentDoc, IAppointmentEntity } from './appointment.interface';

export interface IAppointmentService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AppointmentDoc[]>;

  createRawQueryFindAllWithVehicleService(
    find?: Record<string, any>,
  ): PipelineStage[];

  findAllWithVehicleService(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IAppointmentEntity[]>;

  getTotalWithVehicleService(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<AppointmentDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: AppointmentCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<AppointmentDoc>;

  update(
    repository: AppointmentDoc,
    payload: AppointmentUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentDoc>;

  softDelete(
    repository: AppointmentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AppointmentDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: AppointmentDoc[]): AppointmentListResponseDto[];
  mapGet(data: IAppointmentDoc): AppointmentGetResponseDto;
}
