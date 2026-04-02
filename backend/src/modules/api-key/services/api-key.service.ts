import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HelperService } from '@/common/helper/services/helper.service';
import { ApiKeyCreateRequestDto } from '@/modules/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from '@/modules/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateRequestDto } from '@/modules/api-key/dtos/request/api-key.update.request.dto';
import { IApiKeyService } from '@/modules/api-key/interfaces/api-key.service.interface';
import { EnumHelperDateDayOf } from '@/common/helper/enums/helper.enum';
import { EnumApiKeyStatusCodeError } from '@/modules/api-key/enums/api-key.status-code.enum';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IApiKeyListFilters } from '@/modules/api-key/interfaces/api-key.filter.interface';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { ApiKeyUtil } from '@/modules/api-key/utils/api-key.util';
import { ApiKeyRepository } from '@/modules/api-key/repositories/api-key.repository';
import { ApiKeyUpdateStatusRequestDto } from '@/modules/api-key/dtos/request/api-key.update-status.request.dto';
import { EnumApiKeyType } from '../enums/api-key.enum';
import { ApiKeyModel } from '../models/api-key.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class ApiKeyService implements IApiKeyService {
  constructor(
    private readonly helperService: HelperService,
    private readonly apiKeyUtil: ApiKeyUtil,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    filters?: IApiKeyListFilters
  ): Promise<IPaginationOffsetReturn<ApiKeyModel>> {
    const { data, ...others } =
      await this.apiKeyRepository.findWithPaginationOffset(
        pagination,
        filters
      );

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    filters?: IApiKeyListFilters
  ): Promise<IPaginationCursorReturn<ApiKeyModel>> {
    const { data, ...others } =
      await this.apiKeyRepository.findWithPaginationCursor(
        pagination,
        filters
      );

    return {
      data,
      ...others,
    };
  }

  async createByAdmin(
    { name, type, startAt, endAt }: ApiKeyCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<{ created: ApiKeyModel; secret: string }> {
    const { key, secret, hash } = this.apiKeyUtil.generateCredential();
    const created = await this.apiKeyRepository.create(
      {
        name,
        type,
        startAt,
        endAt,
      },
      key,
      hash
    );

    return { created, secret };
  }

  async updateStatusByAdmin(
    id: string,
    data: ApiKeyUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel> {
    const today = this.helperService.dateCreate();
    const apiKey = await this.apiKeyRepository.findOneById(id);
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

    const [updated] = await Promise.all([
      this.apiKeyRepository.updateStatus(id, data),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return updated;
  }

  async updateByAdmin(
    id: string,
    { name }: ApiKeyUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel> {
    const apiKey = await this.apiKeyRepository.findOneById(id);
    this.validateApiKey(apiKey, true);

    const [updated] = await Promise.all([
      this.apiKeyRepository.updateName(id, name),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return updated;
  }

  async updateDatesByAdmin(
    id: string,
    { startAt, endAt }: ApiKeyUpdateDateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel> {
    const apiKey = await this.apiKeyRepository.findOneById(id);
    this.validateApiKey(apiKey, true);

    const [updated] = await Promise.all([
      this.apiKeyRepository.updateDates(id, {
        startAt: this.helperService.dateCreate(startAt, {
          dayOf: EnumHelperDateDayOf.start,
        }),
        endAt: this.helperService.dateCreate(endAt, {
          dayOf: EnumHelperDateDayOf.end,
        }),
      }),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return updated;
  }

  async resetByAdmin(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<{ updated: ApiKeyModel; secret: string }> {
    const apiKey = await this.apiKeyRepository.findOneById(id);
    this.validateApiKey(apiKey, true);

    const secret: string = this.apiKeyUtil.createSecret();
    const hash: string = this.apiKeyUtil.createHash(apiKey.key, secret);
    const [updated] = await Promise.all([
      this.apiKeyRepository.updateHash(id, hash),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return { updated, secret };
  }

  async deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel> {
    const apiKey = await this.apiKeyRepository.findOneById(id);
    if (!apiKey) {
      throw new NotFoundException({
        statusCode: EnumApiKeyStatusCodeError.notFound,
        message: 'apiKey.error.notFound',
      });
    }

    const [deleted] = await Promise.all([
      this.apiKeyRepository.delete(id),
      this.apiKeyUtil.deleteCacheByKey(apiKey.key),
    ]);

    return deleted;
  }

  validateApiKey(apiKey: ApiKeyModel, includeActive: boolean = false): void {
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

  async findOneActiveByKeyAndCache(key: string): Promise<ApiKeyModel | null> {
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

  async validateXApiKeyGuard(request: IRequestApp): Promise<ApiKeyModel> {
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
    const apiKey: ApiKeyModel = await this.findOneActiveByKeyAndCache(key);

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
    apiKeyTypes: EnumApiKeyType[]
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
}
