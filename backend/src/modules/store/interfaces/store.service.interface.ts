import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { StoreDoc } from '../entities/store.entity';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IStoreService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: StoreDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: StoreDoc[]; total?: number }>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<StoreDoc>;

  findOneById(storeId: string): Promise<StoreDoc>;

  findOneBySlug(slug: string): Promise<StoreDoc>;

  create(
    payload: StoreCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<StoreDoc>;

  update(
    storeId: string,
    payload: StoreUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  updateStatus(
    storeId: string,
    payload: StoreUpdateStatusRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  delete(storeId: string, options?: IDatabaseUpdateOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<void>;
}
