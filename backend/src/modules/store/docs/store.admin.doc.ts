import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  StoreDocParamsId,
  StoreDocQueryStatus,
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
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreGetResponseDto } from '../dtos/response/store.get.response.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';

export function StoreAdminListDoc(): MethodDecorator {
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

export function StoreAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new store',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: StoreCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<StoreGetResponseDto>('store.create', {
      dto: StoreGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function StoreAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a store',
    }),
    DocRequest({
      params: StoreDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: StoreUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.update'),
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
    DocResponse('store.delete'),
  );
}

export function StoreAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of store',
    }),
    DocRequest({
      params: StoreDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: StoreUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('store.updateStatus'),
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
    DocResponse<StoreGetResponseDto>('store.getById', {
      dto: StoreGetResponseDto,
    }),
  );
}
