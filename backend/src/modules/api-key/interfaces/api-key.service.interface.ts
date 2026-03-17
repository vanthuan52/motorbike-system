import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ApiKeyDoc, ApiKeyEntity } from '../entities/api-key.entity';
import { ApiKeyCreateRequestDto } from '../dtos/request/api-key.create.request.dto';
import { ApiKeyCreateResponseDto } from '../dtos/response/api-key.create.response.dto';
import { ApiKeyUpdateRequestDto } from '../dtos/request/api-key.update.request.dto';
import { ApiKeyUpdateDateRequestDto } from '../dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateStatusRequestDto } from '../dtos/request/api-key.update-status.request.dto';
import { ApiKeyDto } from '../dtos/api-key.dto';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { EnumApiKeyType } from '../enums/api-key.enum';

export interface IApiKeyService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<IResponsePagingReturn<ApiKeyDto>>;

  create(
    payload: ApiKeyCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>>;

  updateStatus(
    apiKeyId: string,
    data: ApiKeyUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>>;

  update(
    apiKeyId: string,
    payload: ApiKeyUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>>;

  updateDate(
    apiKeyId: string,
    payload: ApiKeyUpdateDateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>>;

  reset(
    apiKeyId: string,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>>;

  delete(
    apiKeyId: string,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<ApiKeyDto>>;

  findOneActiveByKeyAndCache(key: string): Promise<ApiKeyDoc | null>;

  validateXApiKeyGuard(request: IRequestApp): Promise<ApiKeyEntity>;

  validateXApiKeyTypeGuard(
    request: IRequestApp,
    apiKeyTypes: EnumApiKeyType[],
  ): boolean;

  validateApiKey(apiKey: ApiKeyDoc, includeActive?: boolean): void;
}
