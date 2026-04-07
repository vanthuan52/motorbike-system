import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IApiKeyListFilters } from './api-key.filter.interface';
import { ApiKeyCreateRequestDto } from '@/modules/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from '@/modules/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateStatusRequestDto } from '@/modules/api-key/dtos/request/api-key.update-status.request.dto';
import { ApiKeyUpdateRequestDto } from '@/modules/api-key/dtos/request/api-key.update.request.dto';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { ApiKeyModel } from '../models/api-key.model';
import { EnumApiKeyType } from '../enums/api-key.enum';
import { Prisma } from '@/generated/prisma-client';

export interface IApiKeyService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    filters?: IApiKeyListFilters
  ): Promise<IPaginationOffsetReturn<ApiKeyModel>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    filters?: IApiKeyListFilters
  ): Promise<IPaginationCursorReturn<ApiKeyModel>>;
  createByAdmin(
    { name, type, startAt, endAt }: ApiKeyCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<{ created: ApiKeyModel; secret: string }>;
  updateStatusByAdmin(
    id: string,
    data: ApiKeyUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel>;
  updateByAdmin(
    id: string,
    { name }: ApiKeyUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel>;
  
  resetByAdmin(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<{ updated: ApiKeyModel; secret: string }>;
  deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<ApiKeyModel>;
  findOneActiveByKeyAndCache(key: string): Promise<ApiKeyModel | null>;
  validateApiKey(apiKey: ApiKeyModel, includeActive: boolean): void;
  findOneActiveByKeyAndCache(key: string): Promise<ApiKeyModel | null>;
  validateXApiKeyGuard(request: IRequestApp): Promise<ApiKeyModel>;
  validateXApiKeyTypeGuard(
    request: IRequestApp,
    apiKeyTypes: EnumApiKeyType[]
  ): boolean;
}
