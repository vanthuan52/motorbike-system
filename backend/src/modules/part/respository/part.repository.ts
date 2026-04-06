import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { PartModel } from '../models/part.model';
import { PartMapper } from '../mappers/part.mapper';
import { IPartListFilters } from '../interfaces/part.filter.interface';
import { Prisma, Part as PrismaPart } from '@/generated/prisma-client';

@Injectable()
export class PartRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findAll(
    {
      where: baseWhere,
      skip,
      limit,
      orderBy,
      ...rest
    }: IPaginationQueryOffsetParams<Prisma.PartSelect, Prisma.PartWhereInput>,
    filters?: IPartListFilters
  ): Promise<PartModel[]> {
    const mergedWhere: Prisma.PartWhereInput = {
      ...baseWhere,
      ...filters,
    };

    const results = await this.databaseService.part.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        partType: true,
        vehicleBrand: true,
      },
      ...rest,
    });

    return results.map((item: PrismaPart) => PartMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<Prisma.PartSelect, Prisma.PartWhereInput>,
    filters?: IPartListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.PartWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.part.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.PartSelect,
    Prisma.PartWhereInput
  >): Promise<IPaginationOffsetReturn<PartModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaPart>(
      this.databaseService.part,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          partType: true,
          vehicleBrand: true,
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => PartMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.PartSelect,
    Prisma.PartWhereInput
  >): Promise<IPaginationCursorReturn<PartModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaPart>(
      this.databaseService.part,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          partType: true,
          vehicleBrand: true,
        },
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => PartMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<PartModel | null> {
    const result = await this.databaseService.part.findUnique({
      where: { id },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });

    return result ? PartMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<PartModel | null> {
    const result = await this.databaseService.part.findFirst({
      where: { slug },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });

    return result ? PartMapper.toDomain(result) : null;
  }

  async findOne(where: Prisma.PartWhereInput): Promise<PartModel | null> {
    const result = await this.databaseService.part.findFirst({
      where,
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });

    return result ? PartMapper.toDomain(result) : null;
  }

  async create(data: Prisma.PartCreateInput): Promise<PartModel> {
    const result = await this.databaseService.part.create({
      data,
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });

    return PartMapper.toDomain(result);
  }

  async update(id: string, data: Prisma.PartUpdateInput): Promise<PartModel> {
    const result = await this.databaseService.part.update({
      where: { id },
      data,
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });

    return PartMapper.toDomain(result);
  }

  async delete(id: string): Promise<PartModel> {
    const result = await this.databaseService.part.delete({
      where: { id },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });

    return PartMapper.toDomain(result);
  }
}
