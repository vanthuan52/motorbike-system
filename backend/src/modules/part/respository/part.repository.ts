import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { Part, Prisma } from '@/generated/prisma-client';

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
    filters?: Record<string, any>
  ): Promise<Part[]> {
    const mergedWhere: Prisma.PartWhereInput = {
      ...baseWhere,
      ...filters,
    };

    return this.databaseService.part.findMany({
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
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<Prisma.PartSelect, Prisma.PartWhereInput>,
    filters?: Record<string, any>
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
  >): Promise<{
    data: Part[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<Part>(this.databaseService.part, {
      ...params,
      where: {
        ...where,
      },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.PartSelect,
    Prisma.PartWhereInput
  >): Promise<{
    data: Part[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<Part>(this.databaseService.part, {
      ...params,
      where: {
        ...where,
      },
      include: {
        partType: true,
        vehicleBrand: true,
      },
      includeCount: true,
    });
  }

  async findOneById(id: string): Promise<Part | null> {
    return this.databaseService.part.findUnique({
      where: { id },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }

  async findOneBySlug(slug: string): Promise<Part | null> {
    return this.databaseService.part.findFirst({
      where: { slug },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }

  async findOne(where: Prisma.PartWhereInput): Promise<Part | null> {
    return this.databaseService.part.findFirst({
      where,
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }

  async create(data: Prisma.PartCreateInput): Promise<Part> {
    return this.databaseService.part.create({
      data,
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }

  async update(id: string, data: Prisma.PartUpdateInput): Promise<Part> {
    return this.databaseService.part.update({
      where: { id },
      data,
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }

  async delete(id: string): Promise<Part> {
    return this.databaseService.part.delete({
      where: { id },
      include: {
        partType: true,
        vehicleBrand: true,
      },
    });
  }
}
