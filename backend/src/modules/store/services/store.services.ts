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
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumStoreStatusCodeError } from '../enums/store.status-code.enum';
import { StoreUtil } from '../utils/store.util';
import { Store, Prisma } from '@/generated/prisma-client';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeUtil: StoreUtil
  ) {}

  async getListOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<Prisma.StoreSelect, Prisma.StoreWhereInput>,
    status?: Record<string, IPaginationIn>
  ): Promise<{ data: Store[]; total: number }> {
    const mergedWhere: Prisma.StoreWhereInput = {
      ...where,
      ...status,
    };

    const [stores, total] = await Promise.all([
      this.storeRepository.findAll(
        {
          limit,
          skip,
          where: mergedWhere,
          orderBy,
        },
        status
      ),
      this.storeRepository.getTotal(
        {
          limit,
          skip,
          where: mergedWhere,
          orderBy,
        },
        status
      ),
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
    }: IPaginationQueryCursorParams<Prisma.StoreSelect, Prisma.StoreWhereInput>,
    status?: Record<string, IPaginationIn>
  ): Promise<{ data: Store[]; total?: number }> {
    const mergedWhere: Prisma.StoreWhereInput = {
      ...where,
      ...status,
    };

    const { data, count } = await this.storeRepository.findWithPaginationCursor(
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      },
      status
    );

    return { data, total: count };
  }

  async findOne(find: Record<string, any>): Promise<Store> {
    const store = await this.storeRepository.findOne(find);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    return store;
  }

  async findOneById(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }
    return store;
  }

  async findOneBySlug(slug: string): Promise<Store> {
    const store = await this.storeRepository.findOneBySlug(slug);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }
    return store;
  }

  async create(payload: StoreCreateRequestDto): Promise<{ id: string }> {
    // Validate slug uniqueness
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
    }

    const slug =
      payload.slug ?? (await this.storeUtil.createSlug(payload.name));

    const data: Prisma.StoreCreateInput = {
      name: payload.name,
      address: payload.address,
      workHours: payload.workHours,
      description: payload.description ?? null,
      slug: slug,
      status: 'active',
    };

    const created = await this.storeRepository.create(data);
    return { id: created.id };
  }

  async update(storeId: string, payload: StoreUpdateRequestDto): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
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
    }

    const data: Prisma.StoreUpdateInput = {
      name: payload.name ?? undefined,
      address: payload.address ?? undefined,
      workHours: payload.workHours ?? undefined,
      description: payload.description ?? undefined,
      slug: payload.slug ? payload.slug : undefined,
    };

    await this.storeRepository.update(storeId, data);
  }

  async updateStatus(
    storeId: string,
    { status }: StoreUpdateStatusRequestDto
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

  async delete(storeId: string): Promise<void> {
    const store = await this.storeRepository.findOneById(storeId);
    if (!store) {
      throw new NotFoundException({
        statusCode: EnumStoreStatusCodeError.notFound,
        message: 'store.error.notFound',
      });
    }

    await this.storeRepository.delete(storeId);
  }
}
