import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { StoreGetResponseDto } from '../dtos/response/store.get.response.dto';
import {
  StoreDocParamsId,
  StoreDocQueryStatus,
} from '../constants/store-doc.constants';
import { applyDecorators } from '@nestjs/common';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';

export function StoreUserGetDoc(): MethodDecorator {
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
    DocResponse<StoreGetResponseDto>('store.getById', {
      dto: StoreGetResponseDto,
    }),
  );
}

export function StoreUserListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all stores',
    }),
    DocRequest({
      queries: [...StoreDocQueryStatus],
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
