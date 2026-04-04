import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecordCondition, Prisma } from '@/generated/prisma-client';
import { ICareRecordConditionListFilters } from './care-record-condition.filter.interface';

export interface ICareRecordConditionService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordConditionSelect,
      Prisma.CareRecordConditionWhereInput
    >,
    filters?: ICareRecordConditionListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordCondition>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordConditionSelect,
      Prisma.CareRecordConditionWhereInput
    >,
    filters?: ICareRecordConditionListFilters
  ): Promise<IPaginationCursorReturn<CareRecordCondition>>;

  findOneById(id: string): Promise<CareRecordCondition>;

  create(
    payload: CareRecordConditionCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordConditionUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
