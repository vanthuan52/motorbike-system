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
import { CareRecordDoc } from '../entities/care-record.entity';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import { ICareRecordEntity } from './care-record.interface';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';

export interface ICareRecordService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordDoc[]>;

  findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordEntity[]>;

  getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc>;

  update(
    repository: CareRecordDoc,
    payload: CareRecordUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  updateStatus(
    repository: CareRecordDoc,
    { status }: CareRecordUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  updatePaymentStatus(
    repository: CareRecordDoc,
    { paymentStatus }: CareRecordUpdatePaymentStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  updateTechnician(
    repository: CareRecordDoc,
    { technician }: CareRecordUpdateTechnicianRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  softDelete(
    repository: CareRecordDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: CareRecordDoc[]): CareRecordListResponseDto[];

  mapGet(data: CareRecordDoc): CareRecordGetResponseDto;

  mapGetPopulate(
    careRecord: CareRecordDoc | ICareRecordEntity,
  ): CareRecordGetFullResponseDto;
}
