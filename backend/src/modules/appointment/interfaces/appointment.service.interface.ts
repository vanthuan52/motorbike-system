import {
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
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

  findOneById(id: string): Promise<AppointmentModel>;

  create(
    payload: AppointmentCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel>;

  update(
    id: string,
    payload: AppointmentUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel>;

  updateStatus(
    id: string,
    payload: AppointmentUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<AppointmentModel>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<AppointmentModel>>;

  restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<AppointmentModel>;

  forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<AppointmentModel>;
}
