import {
  IPaginationEqual,
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { ApiKeyCreateRequestDto } from '@/modules/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from '@/modules/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateStatusRequestDto } from '@/modules/api-key/dtos/request/api-key.update-status.request.dto';
import { ApiKeyUpdateRequestDto } from '@/modules/api-key/dtos/request/api-key.update.request.dto';
import { ApiKey, EnumApiKeyType, Prisma } from '@/generated/prisma-client';

export interface IApiKeyService {
  getListByAdmin(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    isActive?: Record<string, IPaginationEqual>,
    type?: Record<string, IPaginationIn>
  ): Promise<{ data: ApiKey[]; total: number }>;
  createByAdmin({
    name,
    type,
    startAt,
    endAt,
  }: ApiKeyCreateRequestDto): Promise<{ created: ApiKey; secret: string }>;
  updateStatusByAdmin(
    id: string,
    data: ApiKeyUpdateStatusRequestDto
  ): Promise<ApiKey>;
  updateByAdmin(id: string, { name }: ApiKeyUpdateRequestDto): Promise<ApiKey>;
  updateDatesByAdmin(
    id: string,
    { startAt, endAt }: ApiKeyUpdateDateRequestDto
  ): Promise<ApiKey>;
  resetByAdmin(id: string): Promise<{ updated: ApiKey; secret: string }>;
  deleteByAdmin(id: string): Promise<ApiKey>;
  findOneActiveByKeyAndCache(key: string): Promise<ApiKey | null>;
  validateApiKey(apiKey: ApiKey, includeActive: boolean): void;
  findOneActiveByKeyAndCache(key: string): Promise<ApiKey | null>;
  validateXApiKeyGuard(request: IRequestApp): Promise<ApiKey>;
  validateXApiKeyTypeGuard(
    request: IRequestApp,
    apiKeyTypes: EnumApiKeyType[]
  ): boolean;
}
