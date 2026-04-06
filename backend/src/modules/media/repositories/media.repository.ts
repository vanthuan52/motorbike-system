import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { MediaModel } from '../models/media.model';
import { MediaMapper } from '../mappers/media.mapper';
import { Prisma, Media as PrismaMedia } from '@/generated/prisma-client';

@Injectable()
export class MediaRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.MediaSelect,
    Prisma.MediaWhereInput
  >): Promise<IPaginationOffsetReturn<MediaModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaMedia>(
      this.databaseService.media,
      {
        ...params,
        where: {
          ...where,
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => MediaMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.MediaSelect,
    Prisma.MediaWhereInput
  >): Promise<IPaginationCursorReturn<MediaModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaMedia>(
      this.databaseService.media,
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
      data: paginatedResult.data.map(item => MediaMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<MediaModel | null> {
    const result = await this.databaseService.media.findUnique({
      where: { id },
    });

    return result ? MediaMapper.toDomain(result) : null;
  }

  async findOne(where: Prisma.MediaWhereInput): Promise<MediaModel | null> {
    const result = await this.databaseService.media.findFirst({
      where,
    });

    return result ? MediaMapper.toDomain(result) : null;
  }

  async findByKey(key: string): Promise<MediaModel | null> {
    const result = await this.databaseService.media.findFirst({
      where: { key },
    });

    return result ? MediaMapper.toDomain(result) : null;
  }

  async create(data: Prisma.MediaCreateInput): Promise<MediaModel> {
    const result = await this.databaseService.media.create({
      data,
    });

    return MediaMapper.toDomain(result);
  }

  async update(id: string, data: Prisma.MediaUpdateInput): Promise<MediaModel> {
    const result = await this.databaseService.media.update({
      where: { id },
      data,
    });

    return MediaMapper.toDomain(result);
  }

  async delete(id: string): Promise<MediaModel> {
    const result = await this.databaseService.media.delete({
      where: { id },
    });

    return MediaMapper.toDomain(result);
  }
}
