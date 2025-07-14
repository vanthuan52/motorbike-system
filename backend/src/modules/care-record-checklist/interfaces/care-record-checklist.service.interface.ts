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
import { CareRecordChecklistDoc } from '../entities/care-record-checklist.entity';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistGetResponseDto } from '../dtos/response/care-record-checklist.get.response.dto';
import { ICareRecordChecklistEntity } from './care-record-checklist.interface';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';

export interface ICareRecordChecklistService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordChecklistDoc[]>;

  findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordChecklistEntity[]>;

  getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordChecklistDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordChecklistDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareRecordChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordChecklistDoc>;

  update(
    repository: CareRecordChecklistDoc,
    payload: CareRecordChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc>;

  updateStatus(
    repository: CareRecordChecklistDoc,
    { status }: CareRecordChecklistUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc>;

  updateNote(
    repository: CareRecordChecklistDoc,
    { note }: CareRecordChecklistUpdateNoteRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc>;

  updateWearPercentage(
    repository: CareRecordChecklistDoc,
    { wearPercentage }: CareRecordChecklistUpdateWearPercentageRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc>;

  softDelete(
    repository: CareRecordChecklistDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: CareRecordChecklistDoc[]): CareRecordChecklistListResponseDto[];

  mapGet(data: CareRecordChecklistDoc): CareRecordChecklistGetResponseDto;

  mapGetPopulate(
    CareRecordChecklist: CareRecordChecklistDoc | ICareRecordChecklistEntity,
  ): CareRecordChecklistGetFullResponseDto;
}
