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
    const result = await this.databaseService.store.findUnique({
      where: { id },
    });
    return result ? StoreMapper.toDomain(result) : null;
  }

  async findOne(find: Record<string, any>): Promise<StoreModel | null> {
    const result = await this.databaseService.store.findFirst({
      where: find,
    });
    return result ? StoreMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<StoreModel | null> {
    const result = await this.databaseService.store.findFirst({
      where: { slug },
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
      where: { id },
      data,
    });
    return StoreMapper.toDomain(result);
  }

  async delete(id: string): Promise<StoreModel> {
    const result = await this.databaseService.store.delete({
      where: { id },
    });
    return StoreMapper.toDomain(result);
  }
}
