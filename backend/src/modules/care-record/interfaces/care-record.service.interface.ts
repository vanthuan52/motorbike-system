import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordDoc } from '../entities/care-record.entity';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import { ICareRecordEntity } from '../interfaces/care-record.interface';

export interface ICareRecordService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<{ data: ICareRecordEntity[]; total: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc>;

  create(
    payload: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc>;

  createWithAppointment(
    payload: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc>;

  update(
    id: string,
    payload: CareRecordUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updatePaymentStatus(
    id: string,
    payload: CareRecordUpdatePaymentStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateTechnician(
    id: string,
    payload: CareRecordUpdateTechnicianRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseDeleteOptions): Promise<void>;

  softDelete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  createCareRecordServices(
    appointment: any,
    careRecordId: string,
    createdBy: string,
  ): Promise<void>;

  createCareRecordChecklists(
    appointment: any,
    careRecordId: string,
    createdBy: string,
  ): Promise<void>;
}
