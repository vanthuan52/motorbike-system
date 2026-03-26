import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { StoreModel } from '../models/store.model';
import { StoreMapper } from '../mappers/store.mapper';
import { Store, Prisma } from '@/generated/prisma-client';

@Injectable()
export class StoreRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<Prisma.StoreSelect, Prisma.StoreWhereInput>,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<StoreModel>> {
    const paginatedResult = await this.paginationService.offset<
      Store,
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >(this.databaseService.store, {
      ...params,
      where: {
        ...where,
        ...status,
        deletedAt: null,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => StoreMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<Prisma.StoreSelect, Prisma.StoreWhereInput>,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<StoreModel>> {
    const paginatedResult = await this.paginationService.cursor<
      Store,
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >(this.databaseService.store, {
      ...params,
      where: {
        ...where,
        ...status,
        deletedAt: null,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => StoreMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<Store | null> {
    return this.databaseService.store.findUnique({
      where: { id },
    });
  }

  async findOne(find: Record<string, any>): Promise<Store | null> {
    return this.databaseService.store.findFirst({
      where: find,
    });
  }

  async findOneBySlug(slug: string): Promise<Store | null> {
    return this.databaseService.store.findFirst({
      where: { slug },
    });
  }

  async create(data: Prisma.StoreCreateInput): Promise<Store> {
    return this.databaseService.store.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StoreUpdateInput): Promise<Store> {
    return this.databaseService.store.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Store> {
    return this.databaseService.store.delete({
      where: { id },
    });
  }
}
