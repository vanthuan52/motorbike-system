import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { Store, Prisma } from '@/generated/prisma-client';

@Injectable()
export class StoreRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<Store[]> {
    const mergedWhere: Prisma.StoreWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.store.findMany({
      where: mergedWhere,
      take: limit,
      skip,
      orderBy,
    });
  }

  async getTotal(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<number> {
    const mergedWhere: Prisma.StoreWhereInput = {
      ...where,
      ...filters,
    };

    return this.databaseService.store.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: Store[]; count: number }> {
    const mergedWhere: Prisma.StoreWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.offsetRaw<Store>(
      this.databaseService.store,
      {
        limit,
        skip,
        where: mergedWhere,
        orderBy,
      }
    );
  }

  async findWithPaginationCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: Store[]; count?: number }> {
    const mergedWhere: Prisma.StoreWhereInput = {
      ...where,
      ...filters,
    };

    return this.paginationService.cursorRaw<Store>(
      this.databaseService.store,
      {
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      }
    );
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
