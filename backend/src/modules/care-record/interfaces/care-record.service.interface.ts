import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecordModel } from '../models/care-record.model';
import { Prisma } from '@/generated/prisma-client';
import { ICareRecordListFilters } from './care-record.filter.interface';

export interface ICareRecordService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: ICareRecordListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordModel>>;

  findOne(where: Prisma.CareRecordWhereInput): Promise<CareRecordModel | null>;

  create(
    payload: CareRecordCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecordModel>;

  update(
    id: string,
    payload: CareRecordUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecordModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecordModel>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: ICareRecordListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordModel>>;

  restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<CareRecordModel>;

  forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<CareRecordModel>;
}
