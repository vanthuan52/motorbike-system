import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { StoreModel } from '../models/store.model';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';

export interface IStoreService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<StoreModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<StoreModel>>;

  findOne(find: Record<string, any>): Promise<StoreModel>;

  findOneById(storeId: string): Promise<StoreModel>;

  findOneBySlug(slug: string): Promise<StoreModel>;

  create(
    payload: StoreCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<DatabaseIdDto>;

  update(
    storeId: string,
    payload: StoreUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  updateStatus(
    storeId: string,
    payload: StoreUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  existBySlug(slug: string): Promise<boolean>;

  delete(
    storeId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >
  ): Promise<IPaginationOffsetReturn<StoreModel>>;

  restore(
    storeId: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<void>;

  forceDelete(
    storeId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void>;
}
