import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecordItemModel } from '../models/care-record-item.model';
import { Prisma } from '@/generated/prisma-client';
import { ICareRecordItemListFilters } from './care-record-item.filter.interface';

export interface ICareRecordItemService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordItemSelect,
      Prisma.CareRecordItemWhereInput
    >,
    filters?: ICareRecordItemListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordItemModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordItemSelect,
      Prisma.CareRecordItemWhereInput
    >,
    filters?: ICareRecordItemListFilters
  ): Promise<IPaginationCursorReturn<CareRecordItemModel>>;

  findOneById(id: string): Promise<CareRecordItemModel>;

  create(
    payload: CareRecordItemCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordItemUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  updateApproval(
    id: string,
    payload: CareRecordItemUpdateApprovalRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
