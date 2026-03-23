import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { Media, Prisma } from '@/generated/prisma-client';

@Injectable()
export class MediaRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.MediaSelect,
      Prisma.MediaWhereInput
    >
  ): Promise<{
    data: Media[];
    count: number;
    page: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage?: number;
    previousPage?: number;
  }> {
    return this.paginationService.offsetRaw<Media>(
      this.databaseService.media,
      {
        ...params,
        where: {
          ...where,
        },
      }
    );
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.MediaSelect,
      Prisma.MediaWhereInput
    >
  ): Promise<{
    data: Media[];
    count?: number;
    cursor?: string;
    hasNext: boolean;
  }> {
    return this.paginationService.cursorRaw<Media>(
      this.databaseService.media,
      {
        ...params,
        where: {
          ...where,
        },
        includeCount: true,
      }
    );
  }

  async findOneById(id: string): Promise<Media | null> {
    return this.databaseService.media.findUnique({
      where: { id },
    });
  }

  async findOne(
    where: Prisma.MediaWhereInput
  ): Promise<Media | null> {
    return this.databaseService.media.findFirst({
      where,
    });
  }

  async findByKey(key: string): Promise<Media | null> {
    return this.databaseService.media.findFirst({
      where: { key },
    });
  }

  async create(data: Prisma.MediaCreateInput): Promise<Media> {
    return this.databaseService.media.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.MediaUpdateInput
  ): Promise<Media> {
    return this.databaseService.media.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Media> {
    return this.databaseService.media.delete({
      where: { id },
    });
  }
}
  }
}
