import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  StoreDocParamsId,
  StoreDocQueryList,
} from '../constants/store-doc.constants';
import { applyDecorators } from '@nestjs/common';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreDto } from '../dtos/store.dto';

export function StorePublicGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a store',
    }),
    DocRequest({
      params: StoreDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<StoreDto>('store.getById', {
      dto: StoreDto,
    }),
  );
}

export function StorePublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all stores',
    }),
    DocRequest({
      queries: StoreDocQueryList,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<StoreListResponseDto>('store.list', {
      dto: StoreListResponseDto,
    }),
  );
}
