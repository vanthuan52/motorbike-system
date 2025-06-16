import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  PartTypeDocParamsId,
  PartTypeDocQueryStatus,
} from '../constants/part-type.doc.constant';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
export function PartTypeAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all part types',
    }),
    DocRequest({
      queries: [...PartTypeDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<PartTypeListResponseDto>('part-type.list', {
      dto: PartTypeListResponseDto,
    }),
  );
}

export function PartTypeAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new part type',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: PartTypeCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PartTypeGetResponseDto>('part-type.create', {
      dto: PartTypeGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function PartTypeAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a part type',
    }),
    DocRequest({
      params: PartTypeDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: PartTypeUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('part-type.update'),
  );
}

export function PartTypeAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a part type',
    }),
    DocRequest({
      params: PartTypeDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('part-type.delete'),
  );
}

export function PartTypeAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of part type',
    }),
    DocRequest({
      params: PartTypeDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: PartTypeUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('part-type.updateStatus'),
  );
}

export function PartTypeAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get part type by id',
    }),
    DocRequest({
      params: PartTypeDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PartTypeGetResponseDto>('part-type.getById', {
      dto: PartTypeGetResponseDto,
    }),
  );
}