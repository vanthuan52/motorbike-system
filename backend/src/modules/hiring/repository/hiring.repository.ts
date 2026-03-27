import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { HiringModel } from '../models/hiring.model';
import { HiringMapper } from '../mappers/hiring.mapper';
import { Hiring as PrismaHiring, Prisma } from '@/generated/prisma-client';

@Injectable()
export class HiringRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<HiringModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaHiring,
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >(this.databaseService.hiring, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => HiringMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<HiringModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaHiring,
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >(this.databaseService.hiring, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      includeCount: true,
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => HiringMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<HiringModel | null> {
    const result = await this.databaseService.hiring.findUnique({
      where: { id },
    });
    return result ? HiringMapper.toDomain(result) : null;
  }

  async findOne(where: Prisma.HiringWhereInput): Promise<HiringModel | null> {
    const result = await this.databaseService.hiring.findFirst({
      where,
    });
    return result ? HiringMapper.toDomain(result) : null;
  }

  async create(data: Prisma.HiringCreateInput): Promise<HiringModel> {
    const result = await this.databaseService.hiring.create({
      data,
    });
    return HiringMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.HiringUpdateInput
  ): Promise<HiringModel> {
    const result = await this.databaseService.hiring.update({
      where: { id },
      data,
    });
    return HiringMapper.toDomain(result);
  }

  async delete(id: string): Promise<HiringModel> {
    const result = await this.databaseService.hiring.delete({
      where: { id },
    });
    return HiringMapper.toDomain(result);
  }

  async getTotal(where: Prisma.HiringWhereInput): Promise<number> {
    return this.databaseService.hiring.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
