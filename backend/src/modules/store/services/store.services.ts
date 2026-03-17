import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { StoreDoc, StoreEntity } from '../entities/store.entity';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { StoreRepository } from '../repository/store.repository';
import { IStoreService } from '../interfaces/store.service.interface';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_STORE_STATUS_CODE_ERROR } from '../enums/store.status-code.enum';
import { StoreUtil } from '../utils/store.util';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeUtil: StoreUtil,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: StoreDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...status,
    };

    const [stores, total] = await Promise.all([
      this.storeRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.storeRepository.getTotal(find),
    ]);

    return {
      data: stores,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: StoreDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...status };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, total] = await Promise.all([
      this.storeRepository.findAllCursor<StoreDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.storeRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total };
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<StoreDoc> {
    const store = await this.storeRepository.findOne(find, options);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }

    return store;
  }

  async findOneById(
    storeId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<StoreDoc> {
    const store = await this.storeRepository.findOneById(storeId, options);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }
    return store;
  }

  async findOneBySlug(slug: string): Promise<StoreDoc> {
    const store = await this.storeRepository.findOneBySlug(slug);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }
    return store;
  }

  async create(
    payload: StoreCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<StoreDoc> {
    // Validate slug uniqueness
    if (payload.slug) {
      const existingBySlug = await this.storeRepository.findOneBySlug(
        payload.slug,
      );
      if (existingBySlug) {
        throw new ConflictException({
          statusCode: ENUM_STORE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'store.error.slugExisted',
        });
      }
    }

    const create: StoreEntity = new StoreEntity();
    create.name = payload.name;
    create.address = payload.address;
    create.workHours = payload.workHours;
    create.description = payload.description;
    create.slug =
      payload.slug ?? (await this.storeUtil.createSlug(payload.name));

    const created = await this.storeRepository.create(create, options);

    return created;
  }

  async update(
    storeId: string,
    payload: StoreUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }

    // Validate slug uniqueness if changing
    if (payload.slug && payload.slug !== store.slug) {
      const existingBySlug = await this.storeRepository.findOneBySlug(
        payload.slug,
      );
      if (existingBySlug && existingBySlug._id.toString() !== storeId) {
        throw new ConflictException({
          statusCode: ENUM_STORE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'store.error.slugExisted',
        });
      }
    }

    store.name = payload.name ?? store.name;
    store.address = payload.address ?? store.address;
    store.workHours = payload.workHours ?? store.workHours;
    store.description = payload.description ?? store.description;
    store.slug = payload.slug ?? store.slug;

    await this.storeRepository.save(store, options);
  }

  async updateStatus(
    _id: string,
    { status }: StoreUpdateStatusRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(_id);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }

    store.status = status;
    await this.storeRepository.save(store, options);
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const exist = await this.storeRepository.exists({ slug }, options);
    return exist;
  }

  async delete(
    storeId: string,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }

    await this.storeRepository.delete({ _id: storeId }, options);
  }

  async softDelete(
    storeId: string,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: ENUM_STORE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'store.error.notFound',
      });
    }

    await this.storeRepository.softDelete(store, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<void> {
    await this.storeRepository.deleteMany(find, options);
  }
}
