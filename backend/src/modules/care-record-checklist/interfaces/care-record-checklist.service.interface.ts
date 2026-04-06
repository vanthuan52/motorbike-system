import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';
import { CareRecordChecklistModel } from '../models/care-record-checklist.model';
import { Prisma } from '@/generated/prisma-client';
import { ICareRecordChecklistListFilters } from './care-record-checklist.filter.interface';

export interface ICareRecordChecklistService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: ICareRecordChecklistListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordChecklistModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: ICareRecordChecklistListFilters
  ): Promise<IPaginationCursorReturn<CareRecordChecklistModel>>;

  findOneById(id: string): Promise<CareRecordChecklistModel>;

  create(
    payload: CareRecordChecklistCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto>;

  createMany(
    dtos: CareRecordChecklistCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean>;

  update(
    id: string,
    payload: CareRecordChecklistUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordChecklistUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateResult(
    id: string,
    payload: CareRecordChecklistUpdateResultRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateNote(
    id: string,
    payload: CareRecordChecklistUpdateNoteRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateWearPercentage(
    id: string,
    payload: CareRecordChecklistUpdateWearPercentageRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  restore(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  forceDelete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  deleteMany(
    find: Record<string, any>,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean>;
}
