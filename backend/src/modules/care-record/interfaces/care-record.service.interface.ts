import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import { CareRecord, Prisma } from '@/generated/prisma-client';

export interface ICareRecordService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecord[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecord[]; total?: number }>;

  findOneById(id: string): Promise<CareRecord>;

  findOne(where: Prisma.CareRecordWhereInput): Promise<CareRecord | null>;

  create(payload: CareRecordCreateRequestDto): Promise<CareRecord>;

  createWithAppointment(
    payload: CareRecordCreateRequestDto,
    createdBy?: string
  ): Promise<CareRecord>;

  update(id: string, payload: CareRecordUpdateRequestDto): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordUpdateStatusRequestDto
  ): Promise<void>;

  updatePaymentStatus(
    id: string,
    payload: CareRecordUpdatePaymentStatusRequestDto
  ): Promise<void>;

  updateTechnician(
    id: string,
    payload: CareRecordUpdateTechnicianRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  createCareRecordServices(
    appointment: any,
    careRecordId: string,
    createdBy: string
  ): Promise<void>;

  createCareRecordChecklists(
    appointment: any,
    careRecordId: string,
    createdBy: string
  ): Promise<void>;
}
