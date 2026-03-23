import { Prisma, Store } from '@/generated/prisma-client';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';

export interface IStoreService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: Store[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: Store[]; total?: number }>;

  findOne(find: Record<string, any>): Promise<Store>;

  findOneById(storeId: string): Promise<Store>;

  findOneBySlug(slug: string): Promise<Store>;

  create(payload: StoreCreateRequestDto): Promise<{ id: string }>;

  update(
    storeId: string,
    payload: StoreUpdateRequestDto,
  ): Promise<void>;

  updateStatus(
    storeId: string,
    payload: StoreUpdateStatusRequestDto,
  ): Promise<void>;

  existBySlug(slug: string): Promise<boolean>;

  delete(storeId: string): Promise<void>;
}
