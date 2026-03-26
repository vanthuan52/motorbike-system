import { Injectable } from '@nestjs/common';
import {
  IPaginationEqual,
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ApiKeyCreateRequestDto } from '@/modules/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from '@/modules/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateStatusRequestDto } from '@/modules/api-key/dtos/request/api-key.update-status.request.dto';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { ApiKey, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ApiKeyRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findMany(
    {
      where: baseWhere,
      skip,
      limit,
      orderBy,
      ...rest
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    isActive?: Record<string, IPaginationEqual>,
    type?: Record<string, IPaginationIn>
  ): Promise<ApiKey[]> {
    const mergedWhere: Prisma.ApiKeyWhereInput = {
      ...baseWhere,
      ...isActive,
      ...type,
    };

    return this.databaseService.apiKey.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || [
        { createdAt: EnumPaginationOrderDirectionType.desc },
      ],
      ...rest,
    });
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    isActive?: Record<string, IPaginationEqual>,
    type?: Record<string, IPaginationIn>
  ): Promise<number> {
    const mergedWhere: Prisma.ApiKeyWhereInput = {
      ...baseWhere,
      ...isActive,
      ...type,
    };

    return this.databaseService.apiKey.count({
      where: mergedWhere,
    });
  }

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    isActive?: Record<string, IPaginationEqual>,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<ApiKey>> {
    return this.paginationService.offset<ApiKey>(
      this.databaseService.apiKey,
      {
        ...params,
        where: {
          ...where,
          isActive: isActive,
          type: type,
        },
        include: {
          user: false,
        },
      }
    );
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    isActive?: Record<string, IPaginationEqual>,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<ApiKey>> {
    return this.paginationService.cursor<ApiKey>(
      this.databaseService.apiKey,
      {
        ...params,
        where: {
          ...where,
          isActive: isActive,
          type: type,
        },
        include: {
          user: false,
        },
        includeCount: true,
      }
    );
  }

  async create(
    { name, type, startAt, endAt }: ApiKeyCreateRequestDto,
    key: string,
    hash: string
  ): Promise<ApiKey> {
    return this.databaseService.apiKey.create({
      data: {
        name,
        key,
        hash,
        isActive: true,
        type,
        startAt,
        endAt,
      },
    });
  }

  async findOneById(id: string): Promise<ApiKey | null> {
    return this.databaseService.apiKey.findUnique({
      where: {
        id,
      },
    });
  }

  async updateStatus(
    id: string,
    { isActive }: ApiKeyUpdateStatusRequestDto
  ): Promise<ApiKey> {
    return this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
  }

  async updateName(id: string, name: string): Promise<ApiKey> {
    return this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async updateDates(
    id: string,
    { startAt, endAt }: ApiKeyUpdateDateRequestDto
  ): Promise<ApiKey> {
    return this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        startAt,
        endAt,
      },
    });
  }

  async updateHash(id: string, hash: string): Promise<ApiKey> {
    return this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        hash,
      },
    });
  }

  async delete(id: string): Promise<ApiKey> {
    return this.databaseService.apiKey.delete({
      where: {
        id,
      },
    });
  }

  async findOneByKey(key: string): Promise<ApiKey | null> {
    return this.databaseService.apiKey.findUnique({
      where: {
        key,
      },
    });
  }
}
