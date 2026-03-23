import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { Hiring, Prisma } from '@/generated/prisma-client';

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
    >
  ): Promise<{
    data: Hiring[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<Hiring>(
      this.databaseService.hiring,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          candidates: true,
        },
      }
    );
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >
  ): Promise<{
    data: Hiring[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<Hiring>(
      this.databaseService.hiring,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          candidates: true,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<Hiring | null> {
    return this.databaseService.hiring.findUnique({
      where: { id },
      include: {
        candidates: true,
      },
    });
  }

  async findOne(
    where: Prisma.HiringWhereInput
  ): Promise<Hiring | null> {
    return this.databaseService.hiring.findFirst({
      where,
      include: {
        candidates: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Hiring | null> {
    return this.databaseService.hiring.findUnique({
      where: { slug },
      include: {
        candidates: true,
      },
    });
  }

  async create(data: Prisma.HiringCreateInput): Promise<Hiring> {
    return this.databaseService.hiring.create({
      data,
      include: {
        candidates: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.HiringUpdateInput
  ): Promise<Hiring> {
    return this.databaseService.hiring.update({
      where: { id },
      data,
      include: {
        candidates: true,
      },
    });
  }

  async delete(id: string): Promise<Hiring> {
    return this.databaseService.hiring.delete({
      where: { id },
      include: {
        candidates: true,
      },
    });
  }
}

}
