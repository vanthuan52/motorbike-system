import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordCondition, Prisma } from '@/generated/prisma-client';

export interface ICareRecordConditionService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordConditionSelect,
      Prisma.CareRecordConditionWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecordCondition>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordConditionSelect,
      Prisma.CareRecordConditionWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecordCondition>>;

  findOneById(id: string): Promise<CareRecordCondition>;

  create(payload: CareRecordConditionCreateRequestDto): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordConditionUpdateRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
