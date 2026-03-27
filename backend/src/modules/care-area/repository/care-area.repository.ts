import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CareAreaModel } from '../models/care-area.model';
import { CareAreaMapper } from '../mappers/care-area.mapper';
import { CareArea as PrismaCareArea, Prisma } from '@/generated/prisma-client';

@Injectable()
export class CareAreaRepository {
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
    }: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<CareAreaModel[]> {
    const mergedWhere: Prisma.CareAreaWhereInput = {
      ...baseWhere,
      ...filters,
    };

    const results = await this.databaseService.careArea.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || { createdAt: 'desc' },
      ...rest,
    });

    return results.map((item: PrismaCareArea) => CareAreaMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<number> {
    const mergedWhere: Prisma.CareAreaWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.careArea.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.CareAreaSelect,
    Prisma.CareAreaWhereInput
  >): Promise<IPaginationOffsetReturn<CareAreaModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaCareArea>(
      this.databaseService.careArea,
      {
        ...params,
        where: {
          ...where,
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareAreaMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.CareAreaSelect,
    Prisma.CareAreaWhereInput
  >): Promise<IPaginationCursorReturn<CareAreaModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaCareArea>(
      this.databaseService.careArea,
      {
        ...params,
        where: {
          ...where,
        },
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CareAreaMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<CareAreaModel | null> {
    const result = await this.databaseService.careArea.findUnique({
      where: { id },
    });

    return result ? CareAreaMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CareAreaWhereInput
  ): Promise<CareAreaModel | null> {
    const result = await this.databaseService.careArea.findFirst({
      where,
    });

    return result ? CareAreaMapper.toDomain(result) : null;
  }

  async create(data: Prisma.CareAreaCreateInput): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.create({
      data,
    });

    return CareAreaMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CareAreaUpdateInput
  ): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.update({
      where: { id },
      data,
    });

    return CareAreaMapper.toDomain(result);
  }

  async delete(id: string): Promise<CareAreaModel> {
    const result = await this.databaseService.careArea.delete({
      where: { id },
    });

    return CareAreaMapper.toDomain(result);
  }
}
