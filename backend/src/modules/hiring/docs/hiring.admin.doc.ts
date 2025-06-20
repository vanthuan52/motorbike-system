import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { HiringGetResponseDto } from '../dtos/response/hiring.get.response.dto';
import { HiringListResponseDto } from '../dtos/response/hiring.list.response.dto';
import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { HiringUpdateStatusRequestDto } from '../dtos/request/hiring.update-status.request.dto';
import {
  HiringDocParamsId,
  HiringDocQueryStatus,
} from '../constants/hiring-doc.constants';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';

export function HiringAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all hiring',
    }),
    DocRequest({
      queries: [...HiringDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<HiringListResponseDto>('hiring.list', {
      dto: HiringListResponseDto,
    }),
  );
}

export function HiringAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new hiring',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: HiringCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<HiringGetResponseDto>('hiring.create', {
      dto: HiringGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function HiringAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update a hiring' }),
    DocRequest({
      params: HiringDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: HiringUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('hiring.update'),
  );
}

export function HiringAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'delete a hiring' }),
    DocRequest({
      params: HiringDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('hiring.delete'),
  );
}

export function HiringAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update status of hiring' }),
    DocRequest({
      params: HiringDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: HiringUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('hiring.updateStatus'),
  );
}

export function HiringAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail an hiring' }),
    DocRequest({
      params: HiringDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<HiringGetResponseDto>('hiring.getById', {
      dto: HiringGetResponseDto,
    }),
  );
}
