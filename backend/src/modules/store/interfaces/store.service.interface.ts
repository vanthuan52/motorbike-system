import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { StoreDoc, StoreEntity } from '../entities/store.entity';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreGetResponseDto } from '../dtos/response/store.get.response.dto';

export interface IStoreService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<StoreDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<StoreDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseFindAllOptions,
  ): Promise<StoreDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<StoreDoc | null>;

  getTotal(
    find: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: StoreCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<StoreDoc>;

  update(
    repository: StoreDoc,
    payload: StoreUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<StoreDoc>;

  softDelete(
    repository: StoreDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StoreDoc>;

  deleteMany(
    find: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existsByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  existsBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  mapList(store: StoreDoc[] | StoreEntity[]): StoreListResponseDto[];

  mapGet(store: StoreDoc | StoreEntity): StoreGetResponseDto;

  findBySlug(slug: string): Promise<StoreDoc | null>;
}
