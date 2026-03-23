import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { CareRecordItem } from '@/generated/prisma-client';

export interface ICareRecordItemService {
  getListOffset(
    { where, ...params }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordItem[]; total: number }>;

  getListCursor(
    { where, ...params }: IPaginationQueryCursorParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordItem[]; total?: number }>;

  findOneById(id: string): Promise<CareRecordItem>;

  create(payload: CareRecordItemCreateRequestDto): Promise<DatabaseIdDto>;

  update(id: string, payload: CareRecordItemUpdateRequestDto): Promise<void>;

  updateApproval(
    id: string,
    payload: CareRecordItemUpdateApprovalRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
