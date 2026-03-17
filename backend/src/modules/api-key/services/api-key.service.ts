import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IApiKeyService } from '../interfaces/api-key.service.interface';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ApiKeyDoc, ApiKeyEntity } from '../entities/api-key.entity';
import { ApiKeyRepository } from '../repositpory/api-key.repository';
import { ApiKeyCreateRequestDto } from '../dtos/request/api-key.create.request.dto';
import { ApiKeyCreateResponseDto } from '../dtos/response/api-key.create.response.dto';
import { EnumHelperDateDayOf } from '@/common/helper/enums/helper.enum';
import { ApiKeyUpdateRequestDto } from '../dtos/request/api-key.update.request.dto';
import { ApiKeyUpdateDateRequestDto } from '../dtos/request/api-key.update-date.request.dto';
import { EnumApiKeyStatusCodeError } from '../enums/api-key.status-code.enum';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { ApiKeyUtil } from '../utils/api-key.util';
import { EnumApiKeyType } from '../enums/api-key.enum';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { ApiKeyDto } from '../dtos/api-key.dto';
import { ApiKeyUpdateStatusRequestDto } from '../dtos/request/api-key.update-status.request.dto';

@Injectable()
export class ApiKeyService implements IApiKeyService {
  constructor(
    private readonly helperService: HelperService,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiKeyUtil: ApiKeyUtil,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<IResponsePagingReturn<ApiKeyDto>> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [apiKeys, total] = await Promise.all([
      this.apiKeyRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.apiKeyRepository.getTotal(find),
    ]);

    const mapped = this.apiKeyUtil.mapList(apiKeys);
    const totalPage = Math.ceil(total / limit);
    const page = Math.floor(skip / limit) + 1;
    const hasNext = page < totalPage;
    const hasPrevious = page > 1;

    return {
      type: EnumPaginationType.offset,
      count: total,
      perPage: limit,
      page,
      totalPage,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: hasPrevious ? page - 1 : undefined,
      data: mapped,
    };
  }

  async create(
    { name, type, startDate, endDate }: ApiKeyCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>> {
    const { key, secret, hash } = this.apiKeyUtil.generateCredential();

    const data: ApiKeyEntity = new ApiKeyEntity();
    data.name = name;
    data.key = key;
    data.hash = hash;
    data.isActive = true;
    data.type = type;

    if (startDate && endDate) {
      data.startDate = this.helperService.dateCreate(startDate, {
        dayOf: EnumHelperDateDayOf.start,
      });
      data.endDate = this.helperService.dateCreate(endDate, {
        dayOf: EnumHelperDateDayOf.end,
      });
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(
      data,
      options,
    );

    return {
      data: this.apiKeyUtil.mapCreate(created, secret),
    };
  }

  async updateStatus(
    apiKeyId: string,
    data: ApiKeyUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const today = this.helperService.dateCreate();
    const apiKey: ApiKeyDoc = await this.apiKeyRepository.findOneById(apiKeyId);
    if (!apiKey) {
      throw new NotFoundException({
        statusCode: EnumApiKeyStatusCodeError.notFound,
        message: 'apiKey.error.notFound',
      });
    } else if (this.apiKeyUtil.isExpired(apiKey, today)) {
      throw new BadRequestException({
        statusCode: EnumApiKeyStatusCodeError.expired,
        message: 'apiKey.error.expired',
      });
    }

    apiKey.isActive = data.isActive;
    apiKey.updatedAt = today;

    const updated = await this.apiKeyRepository.save(apiKey, options);
    return {
      data: this.apiKeyUtil.mapOne(updated),
    };
  }

  async update(
    apiKeyId: string,
    { name }: ApiKeyUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const apiKey: ApiKeyDoc = await this.apiKeyRepository.findOneById(apiKeyId);
    this.validateApiKey(apiKey, true);

    apiKey.name = name;
    const [updated, _] = await Promise.all([
      this.apiKeyRepository.save(apiKey, options),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return {
      data: this.apiKeyUtil.mapOne(updated),
    };
  }

  async updateDate(
    apiKeyId: string,
    { startDate, endDate }: ApiKeyUpdateDateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const apiKey: ApiKeyDoc = await this.apiKeyRepository.findOneById(apiKeyId);
    this.validateApiKey(apiKey, true);

    apiKey.startDate = this.helperService.dateCreate(startDate, {
      dayOf: EnumHelperDateDayOf.start,
    });
    apiKey.endDate = this.helperService.dateCreate(endDate, {
      dayOf: EnumHelperDateDayOf.end,
    });

    const [updated] = await Promise.all([
      this.apiKeyRepository.save(apiKey, options),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return {
      data: this.apiKeyUtil.mapOne(updated),
    };
  }

  async reset(
    apiKeyId: string,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>> {
    const apiKey: ApiKeyDoc = await this.apiKeyRepository.findOneById(apiKeyId);
    this.validateApiKey(apiKey, true);

    const secret: string = this.apiKeyUtil.createSecret();
    const hash: string = this.apiKeyUtil.createHash(apiKey.key, secret);

    apiKey.hash = hash;
    const [updated] = await Promise.all([
      this.apiKeyRepository.save(apiKey, options),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return {
      data: this.apiKeyUtil.mapCreate(updated, secret),
    };
  }

  async delete(
    apiKeyId: string,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const apiKey: ApiKeyDoc = await this.apiKeyRepository.findOneById(apiKeyId);
    if (!apiKey) {
      throw new NotFoundException({
        statusCode: EnumApiKeyStatusCodeError.notFound,
        message: 'apiKey.error.notFound',
      });
    }

    const [deleted] = await Promise.all([
      this.apiKeyRepository.delete({ _id: apiKeyId }, options),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return {
      data: this.apiKeyUtil.mapOne(deleted),
    };
  }

  async findOneActiveByKeyAndCache(key: string): Promise<ApiKeyDoc | null> {
    const cached = await this.apiKeyUtil.getCacheByKey(key);
    if (cached) {
      return cached;
    }

    const apiKey = await this.apiKeyRepository.findOneByKey(key);
    if (apiKey) {
      await this.apiKeyUtil.setCacheByKey(key, apiKey);
    }

    return apiKey;
  }

  async validateXApiKeyGuard(request: IRequestApp): Promise<ApiKeyEntity> {
    const xApiKeyHeader: string = this.apiKeyUtil
      .extractKeyFromRequest(request)
      ?.trim();
    if (!xApiKeyHeader) {
      throw new UnauthorizedException({
        statusCode: EnumApiKeyStatusCodeError.xApiKeyRequired,
        message: 'apiKey.error.xApiKey.required',
      });
    }

    const xApiKey: string[] = xApiKeyHeader.split(':');
    if (xApiKey.length !== 2 || !xApiKey[0]?.trim() || !xApiKey[1]?.trim()) {
      throw new UnauthorizedException({
        statusCode: EnumApiKeyStatusCodeError.xApiKeyInvalid,
        message: 'apiKey.error.xApiKey.invalid',
      });
    }

    const [key, secret] = xApiKey;
    const today = this.helperService.dateCreate();
    const apiKey: ApiKeyEntity = await this.findOneActiveByKeyAndCache(key);

    if (!apiKey) {
      throw new ForbiddenException({
        statusCode: EnumApiKeyStatusCodeError.xApiKeyNotFound,
        message: 'apiKey.error.xApiKey.notFound',
      });
    } else if (
      !this.apiKeyUtil.validateCredential(key, secret, apiKey) ||
      !this.apiKeyUtil.isValid(apiKey, today)
    ) {
      throw new UnauthorizedException({
        statusCode: EnumApiKeyStatusCodeError.xApiKeyInvalid,
        message: 'apiKey.error.xApiKey.invalid',
      });
    }

    return apiKey;
  }

  validateXApiKeyTypeGuard(
    request: IRequestApp,
    apiKeyTypes: EnumApiKeyType[],
  ): boolean {
    if (apiKeyTypes.length === 0) {
      throw new InternalServerErrorException({
        statusCode: EnumApiKeyStatusCodeError.xApiKeyPredefinedNotFound,
        message: 'apiKey.error.xApiKey.predefinedNotFound',
      });
    }

    const { __apiKey } = request;
    if (!this.apiKeyUtil.validateType(__apiKey, apiKeyTypes)) {
      throw new ForbiddenException({
        statusCode: EnumApiKeyStatusCodeError.xApiKeyForbidden,
        message: 'apiKey.error.xApiKey.forbidden',
      });
    }

    return true;
  }

  validateApiKey(apiKey: ApiKeyDoc, includeActive: boolean = false): void {
    if (!apiKey) {
      throw new NotFoundException({
        statusCode: EnumApiKeyStatusCodeError.notFound,
        message: 'apiKey.error.notFound',
      });
    } else if (includeActive && !this.apiKeyUtil.isActive(apiKey)) {
      throw new BadRequestException({
        statusCode: EnumApiKeyStatusCodeError.inactive,
        message: 'apiKey.error.inactive',
      });
    }

    return;
  }
}
