import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { StoreRepository } from '../repository/store.repository';
import { IStoreService } from '../interfaces/store.service.interface';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumStoreStatusCodeError } from '../enums/store.status-code.enum';
import { StoreUtil } from '../utils/store.util';
import { StoreModel } from '../models/store.model';
import { EnumStoreStatus } from '../enums/store.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeUtil: StoreUtil
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<StoreModel>> {
    const { data, ...others } =
      await this.storeRepository.findWithPaginationOffset(pagination, status);

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<StoreModel>> {
    const { data, ...others } =
      await this.storeRepository.findWithPaginationCursor(pagination, status);

    return {
      data,
      ...others,
    };
  }

  async findOne(find: Record<string, any>): Promise<StoreModel> {
    const store = await this.storeRepository.findOne(find);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    return store;
  }

  async findOneById(storeId: string): Promise<StoreModel> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }
    return store;
  }

  async findOneBySlug(slug: string): Promise<StoreModel> {
    const store = await this.storeRepository.findOneBySlug(slug);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }
    return store;
  }

  async create(
    payload: StoreCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<DatabaseIdDto> {
    let slug = undefined;
    if (payload.slug) {
      const existingBySlug = await this.storeRepository.findOneBySlug(
        payload.slug
      );
      if (existingBySlug) {
        throw new ConflictException({
          statusCode: EnumStoreStatusCodeError.slugExisted,
          message: 'store.error.slugExisted',
        });
      }

      slug = this.storeUtil.createSlug(payload.name);
    }

    const data: Prisma.StoreCreateInput = {
      name: payload.name,
      address: payload.address,
      workHours: payload.workHours,
      description: payload.description ?? null,
      slug: slug,
      status: EnumStoreStatus.active,
    };

    const created = await this.storeRepository.create(data);
    return { id: created.id };
  }

  async update(
    storeId: string,
    payload: StoreUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    let slug = undefined;
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    // Validate slug uniqueness if changing
    if (payload.slug && payload.slug !== store.slug) {
      const existingBySlug = await this.storeRepository.findOneBySlug(
        payload.slug
      );
      if (existingBySlug && existingBySlug.id !== storeId) {
        throw new ConflictException({
          statusCode: EnumStoreStatusCodeError.slugExisted,
          message: 'store.error.slugExisted',
        });
      }
      slug = this.storeUtil.createSlug(payload.name);
    }

    const data: Prisma.StoreUpdateInput = {
      name: payload.name ?? undefined,
      address: payload.address ?? undefined,
      workHours: payload.workHours ?? undefined,
      description: payload.description ?? undefined,
      slug: slug ?? undefined,
    };

    await this.storeRepository.update(storeId, data);
  }

  async updateStatus(
    storeId: string,
    { status }: StoreUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    await this.storeRepository.update(storeId, { status });
  }

  async existBySlug(slug: string): Promise<boolean> {
    const store = await this.storeRepository.findOneBySlug(slug);
    return !!store;
  }

  /**
   * Soft delete a store by setting deletedAt timestamp.
   * The record remains in DB but is hidden from normal queries.
   */
  async delete(
    storeId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    await this.storeRepository.softDelete(storeId, deletedBy);
  }

  // === Trash/Restore ===

  /**
   * Get paginated list of soft-deleted (trashed) stores.
   */
  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >
  ): Promise<IPaginationOffsetReturn<StoreModel>> {
    const { data, ...others } =
      await this.storeRepository.findWithPaginationOffsetTrashed(pagination);

    return {
      data,
      ...others,
    };
  }

  /**
   * Restore a soft-deleted store from trash.
   * Clears deletedAt and deletedBy, making it visible again.
   */
  async restore(
    storeId: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<void> {
    const store =
      await this.storeRepository.findOneByIdIncludeDeleted(storeId);

    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    if (!store.deletedAt) {
      throw new ConflictException({
        statusCode: EnumStoreStatusCodeError.notInTrash,
        message: 'store.error.notInTrash',
      });
    }

    await this.storeRepository.restore(storeId, restoredBy);
  }

  /**
   * Permanently remove a store from the database.
   * The record must already be in trash (soft-deleted).
   * WARNING: This action is irreversible.
   */
  async forceDelete(
    storeId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const store =
      await this.storeRepository.findOneByIdIncludeDeleted(storeId);

    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    if (!store.deletedAt) {
      throw new ConflictException({
        statusCode: EnumStoreStatusCodeError.notInTrash,
        message: 'store.error.notInTrash',
      });
    }

    await this.storeRepository.forceDelete(storeId);
  }
}
