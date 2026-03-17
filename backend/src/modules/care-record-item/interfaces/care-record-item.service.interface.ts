import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { CareRecordItemDoc } from '../entities/care-record-item.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';

export interface ICareRecordItemService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordItemDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordItemDoc[]; total?: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc>;

  create(
    payload: CareRecordItemCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordItemUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateApproval(
    id: string,
    payload: CareRecordItemUpdateApprovalRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
