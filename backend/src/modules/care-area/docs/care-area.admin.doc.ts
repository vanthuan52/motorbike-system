import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  CareAreaDocParamsId,
  CareAreaDocQueryOrderBy,
  CareAreaDocQueryOrderDirection,
} from '../constants/care-area.doc.constant';
import { CareAreaGetResponseDto } from '../dtos/response/care-area.get.response.dto';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';

export function CareAreaAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care area',
    }),
    DocRequest({
      queries: [...CareAreaDocQueryOrderBy, ...CareAreaDocQueryOrderDirection],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareAreaListResponseDto>('care-area.list', {
      dto: CareAreaListResponseDto,
    }),
  );
}

export function CareAreaAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care area',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareAreaCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareAreaGetResponseDto>('care-area.create', {
      dto: CareAreaGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareAreaAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care area',
    }),
    DocRequest({
      params: CareAreaDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareAreaUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.update'),
  );
}

export function CareAreaAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care area',
    }),
    DocRequest({
      params: CareAreaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.delete'),
  );
}

export function CareAreaAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care area by id',
    }),
    DocRequest({
      params: CareAreaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareAreaGetResponseDto>('care-area.getById', {
      dto: CareAreaGetResponseDto,
    }),
  );
}
