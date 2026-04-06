import { Injectable } from '@nestjs/common';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IApiKeyListFilters } from '@/modules/api-key/interfaces/api-key.filter.interface';
import { ApiKeyCreateRequestDto } from '@/modules/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from '@/modules/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateStatusRequestDto } from '@/modules/api-key/dtos/request/api-key.update-status.request.dto';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { ApiKeyModel } from '@/modules/api-key/models/api-key.model';
import { ApiKeyMapper } from '@/modules/api-key/mappers/api-key.mapper';
import { Prisma, ApiKey as PrismaApiKey } from '@/generated/prisma-client';

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
    filters?: IApiKeyListFilters
  ): Promise<ApiKeyModel[]> {
    const mergedWhere: Prisma.ApiKeyWhereInput = {
      ...baseWhere,
      ...filters,
    };

    const results = await this.databaseService.apiKey.findMany({
      where: mergedWhere,
      skip,
      take: limit,
      orderBy: orderBy || [
        { createdAt: EnumPaginationOrderDirectionType.desc },
      ],
      ...rest,
    });

    return results.map(item => ApiKeyMapper.toDomain(item));
  }

  async getTotal(
    {
      where: baseWhere,
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    filters?: IApiKeyListFilters
  ): Promise<number> {
    const mergedWhere: Prisma.ApiKeyWhereInput = {
      ...baseWhere,
      ...filters,
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
    filters?: IApiKeyListFilters
  ): Promise<IPaginationOffsetReturn<ApiKeyModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaApiKey>(
      this.databaseService.apiKey,
      {
        ...params,
        where: {
          ...where,
          ...filters,
        },
        include: {
          user: false,
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ApiKeyMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    filters?: IApiKeyListFilters
  ): Promise<IPaginationCursorReturn<ApiKeyModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaApiKey>(
      this.databaseService.apiKey,
      {
        ...params,
        where: {
          ...where,
          ...filters,
        },
        include: {
          user: false,
        },
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => ApiKeyMapper.toDomain(item)),
    };
  }

  async create(
    { name, type, startAt, endAt }: ApiKeyCreateRequestDto,
    key: string,
    hash: string
  ): Promise<ApiKeyModel> {
    const result = await this.databaseService.apiKey.create({
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

    return ApiKeyMapper.toDomain(result);
  }

  async findOneById(id: string): Promise<ApiKeyModel | null> {
    const result = await this.databaseService.apiKey.findUnique({
      where: {
        id,
      },
    });

    return result ? ApiKeyMapper.toDomain(result) : null;
  }

  async updateStatus(
    id: string,
    { isActive }: ApiKeyUpdateStatusRequestDto
  ): Promise<ApiKeyModel> {
    const result = await this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

    return ApiKeyMapper.toDomain(result);
  }

  async updateName(id: string, name: string): Promise<ApiKeyModel> {
    const result = await this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return ApiKeyMapper.toDomain(result);
  }

  async updateDates(
    id: string,
    { startAt, endAt }: ApiKeyUpdateDateRequestDto
  ): Promise<ApiKeyModel> {
    const result = await this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        startAt,
        endAt,
      },
    });

    return ApiKeyMapper.toDomain(result);
  }

  async updateHash(id: string, hash: string): Promise<ApiKeyModel> {
    const result = await this.databaseService.apiKey.update({
      where: {
        id,
      },
      data: {
        hash,
      },
    });

    return ApiKeyMapper.toDomain(result);
  }

  async delete(id: string): Promise<ApiKeyModel> {
    const result = await this.databaseService.apiKey.delete({
      where: {
        id,
      },
    });

    return ApiKeyMapper.toDomain(result);
  }

  async findOneByKey(key: string): Promise<ApiKeyModel | null> {
    const result = await this.databaseService.apiKey.findUnique({
      where: {
        key,
      },
    });

    return result ? ApiKeyMapper.toDomain(result) : null;
  }
}
