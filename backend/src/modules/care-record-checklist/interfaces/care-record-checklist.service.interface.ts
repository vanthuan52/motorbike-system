import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';

export interface ICareRecordChecklistService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<IResponsePagingReturn<CareRecordChecklistListResponseDto>>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IResponseReturn<CareRecordChecklistGetFullResponseDto>>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IResponseReturn<CareRecordChecklistGetFullResponseDto>>;

  create(
    payload: CareRecordChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<IResponseReturn<{ _id: string }>>;

  createMany(
    dtos: CareRecordChecklistCreateRequestDto[],
    options?: IDatabaseCreateOptions,
  ): Promise<boolean>;

  update(
    id: string,
    payload: CareRecordChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>>;

  updateStatus(
    id: string,
    payload: CareRecordChecklistUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>>;

  updateResult(
    id: string,
    payload: CareRecordChecklistUpdateResultRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>>;

  updateNote(
    id: string,
    payload: CareRecordChecklistUpdateNoteRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>>;

  updateWearPercentage(
    id: string,
    payload: CareRecordChecklistUpdateWearPercentageRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>>;

  delete(
    id: string,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
