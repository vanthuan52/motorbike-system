import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecordMediaModel } from '../models/care-record-media.model';
import { Prisma } from '@/generated/prisma-client';
import { ICareRecordMediaListFilters } from './care-record-media.filter.interface';

export interface ICareRecordMediaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: ICareRecordMediaListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordMediaModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: ICareRecordMediaListFilters
  ): Promise<IPaginationCursorReturn<CareRecordMediaModel>>;

  findOneById(id: string): Promise<CareRecordMediaModel>;

  create(
    payload: CareRecordMediaCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordMediaUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
