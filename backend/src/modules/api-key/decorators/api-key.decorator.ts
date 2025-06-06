import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyPayloadDto } from '../dtos/api-key.payload.dto';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { API_KEY_X_TYPE_META_KEY } from '../constants/api-key.constant';
import { ENUM_API_KEY_TYPE } from '../enums/api-key.enum';
import { ApiKeyXApiKeyGuard } from '../guards/x-api-key/api-key.x-api-key.guard';
import { ApiKeyXApiKeyTypeGuard } from '../guards/x-api-key/api-key.x-api-key.type.guard';

export const ApiKeyPayload: () => ParameterDecorator = createParamDecorator(
  <T = ApiKeyPayloadDto>(data: string, ctx: ExecutionContext): T => {
    const { apiKey } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { apiKey: ApiKeyPayloadDto }>();
    return data ? apiKey[data] : (apiKey as T);
  },
);

export function ApiKeySystemProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyXApiKeyGuard, ApiKeyXApiKeyTypeGuard),
    SetMetadata(API_KEY_X_TYPE_META_KEY, [ENUM_API_KEY_TYPE.SYSTEM]),
  );
}

export function ApiKeyProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyXApiKeyGuard, ApiKeyXApiKeyTypeGuard),
    SetMetadata(API_KEY_X_TYPE_META_KEY, [ENUM_API_KEY_TYPE.DEFAULT]),
  );
}
