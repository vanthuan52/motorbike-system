import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecord, Prisma } from '@/generated/prisma-client';

export interface ICareRecordService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecord>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecord>>;

  findOneById(id: string): Promise<CareRecord>;

  findOne(where: Prisma.CareRecordWhereInput): Promise<CareRecord | null>;

  create(
    payload: CareRecordCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecord>;

  createWithAppointment(
    payload: CareRecordCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecord>;

  update(
    id: string,
    payload: CareRecordUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updatePaymentStatus(
    id: string,
    payload: CareRecordUpdatePaymentStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateTechnician(
    id: string,
    payload: CareRecordUpdateTechnicianRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  createCareRecordServices(
    appointment: any,
    careRecordId: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  createCareRecordChecklists(
    appointment: any,
    careRecordId: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;
}
