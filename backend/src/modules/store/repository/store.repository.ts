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
import { Store as PrismaStore, Prisma } from '@/generated/prisma-client';

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
      PrismaStore,
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
      PrismaStore,
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

  async findOneById(id: string): Promise<StoreModel | null> {
    const result = await this.databaseService.store.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    return result ? StoreMapper.toDomain(result) : null;
  }

  async findOne(find: Record<string, any>): Promise<StoreModel | null> {
    const result = await this.databaseService.store.findFirst({
      where: {
        ...find,
        deletedAt: null,
      },
    });
    return result ? StoreMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<StoreModel | null> {
    const result = await this.databaseService.store.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
    return result ? StoreMapper.toDomain(result) : null;
  }

  async create(data: Prisma.StoreCreateInput): Promise<StoreModel> {
    const result = await this.databaseService.store.create({
      data,
    });
    return StoreMapper.toDomain(result);
  }

  async update(id: string, data: Prisma.StoreUpdateInput): Promise<StoreModel> {
    const result = await this.databaseService.store.update({
      where: {
        id,
        deletedAt: null,
      },
      data,
    });
    return StoreMapper.toDomain(result);
  }

  /**
   * Soft delete: sets deletedAt and deletedBy instead of removing the record.
   */
  async softDelete(id: string, deletedBy: string): Promise<StoreModel> {
    const result = await this.databaseService.store.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
    return StoreMapper.toDomain(result);
  }

  /**
   * Restore a soft-deleted record by clearing deletedAt and deletedBy.
   */
  async restore(id: string, restoredBy: string): Promise<StoreModel> {
    const result = await this.databaseService.store.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
    });
    return StoreMapper.toDomain(result);
  }

  /**
   * Permanently remove a record from the database.
   * WARNING: This action is irreversible. Only for superadmin.
   */
  async forceDelete(id: string): Promise<StoreModel> {
    const result = await this.databaseService.store.delete({
      where: { id },
    });
    return StoreMapper.toDomain(result);
  }

  /**
   * Find a store by ID regardless of soft-delete status.
   * Used for restore and trash detail operations.
   */
  async findOneByIdIncludeDeleted(id: string): Promise<StoreModel | null> {
    const result = await this.databaseService.store.findUnique({
      where: { id },
    });
    return result ? StoreMapper.toDomain(result) : null;
  }

  /**
   * Find trashed (soft-deleted) stores with pagination.
   * Only returns records WHERE deletedAt IS NOT NULL.
   */
  async findWithPaginationOffsetTrashed({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.StoreSelect,
    Prisma.StoreWhereInput
  >): Promise<IPaginationOffsetReturn<StoreModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaStore,
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >(this.databaseService.store, {
      ...params,
      where: {
        ...where,
        deletedAt: { not: null },
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => StoreMapper.toDomain(item)),
    };
  }
}
