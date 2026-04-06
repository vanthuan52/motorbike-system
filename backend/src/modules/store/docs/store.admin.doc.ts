import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  StoreDocParamsId,
  StoreDocQueryList,
} from '../constants/store-doc.constants';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { StoreDto } from '../dtos/store.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

export function StoreAdminListDoc(): MethodDecorator {
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
    })
  );
}

export function StoreAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new store',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: StoreCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('store.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function StoreAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a store',
    }),
    DocRequest({
      params: StoreDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: StoreUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.update')
  );
}

export function StoreAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a store',
    }),
    DocRequest({
      params: StoreDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.delete')
  );
}

export function StoreAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of store',
    }),
    DocRequest({
      params: StoreDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: StoreUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.updateStatus')
  );
}

export function StoreAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get store by id',
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
    })
  );
}

export function StoreAdminTrashListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all soft-deleted stores (trash)',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<StoreListResponseDto>('store.trashList', {
      dto: StoreListResponseDto,
    })
  );
}

export function StoreAdminRestoreDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'restore a soft-deleted store from trash',
    }),
    DocRequest({
      params: StoreDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.restore')
  );
}

export function StoreAdminForceDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'permanently delete a store (irreversible)',
    }),
    DocRequest({
      params: StoreDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.forceDelete')
  );
}
