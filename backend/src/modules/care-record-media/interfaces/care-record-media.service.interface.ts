import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordMedia, Prisma } from '@generated/prisma-client';

export interface ICareRecordMediaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecordMedia>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecordMedia>>;

  findOneById(id: string): Promise<CareRecordMedia>;

  create(payload: CareRecordMediaCreateRequestDto): Promise<DatabaseIdDto>;

  update(id: string, payload: CareRecordMediaUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
