import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordMedia } from '@prisma/client';

export interface ICareRecordMediaService {
  getListOffset(
    { where, ...params }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordMedia[]; total: number }>;

  getListCursor(
    { where, ...params }: IPaginationQueryCursorParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordMedia[]; total?: number }>;

  findOneById(id: string): Promise<CareRecordMedia>;

  create(payload: CareRecordMediaCreateRequestDto): Promise<DatabaseIdDto>;

  update(id: string, payload: CareRecordMediaUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
