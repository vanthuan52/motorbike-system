import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { Appointment, Prisma } from '@/generated/prisma-client';
import {
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IAppointmentService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: Appointment[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: Appointment[]; total?: number }>;

  findOneById(id: string): Promise<Appointment>;

  findOneWithRelationsById(id: string): Promise<Appointment>;

  findOne(find: Record<string, any>): Promise<Appointment | null>;

  findOneWithRelations(find: Record<string, any>): Promise<Appointment | null>;

  create(payload: AppointmentCreateRequestDto): Promise<{ _id: string }>;

  update(
    id: string,
    payload: AppointmentUpdateRequestDto,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: AppointmentUpdateStatusRequestDto,
  ): Promise<void>;

  delete(id: string): Promise<void>;

  softDelete(id: string): Promise<void>;
}
