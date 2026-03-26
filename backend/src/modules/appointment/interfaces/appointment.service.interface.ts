import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { AppointmentModel } from '../models/appointment.model';
import { Prisma } from '@/generated/prisma-client';

export interface IAppointmentService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<AppointmentModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<AppointmentModel>>;

  findOneById(id: string): Promise<AppointmentModel>;

  findOneWithRelationsById(id: string): Promise<AppointmentModel>;

  findOne(find: Record<string, any>): Promise<AppointmentModel | null>;

  findOneWithRelations(
    find: Record<string, any>
  ): Promise<AppointmentModel | null>;

  create(
    payload: AppointmentCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<{ _id: string }>;

  update(
    id: string,
    payload: AppointmentUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: AppointmentUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  softDelete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;
}
