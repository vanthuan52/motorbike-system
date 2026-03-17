import {
  IDatabaseCreateOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { AppointmentDoc } from '../entities/appointment.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IAppointmentService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: AppointmentDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: AppointmentDoc[]; total?: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc>;

  findOneWithRelationsById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc>;

  findOneWithRelations(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<AppointmentDoc>;

  create(
    payload: AppointmentCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: AppointmentUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: AppointmentUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  softDelete(id: string, options?: IDatabaseSaveOptions): Promise<void>;
}
