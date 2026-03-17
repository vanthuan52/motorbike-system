import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { HiringResponseDto } from '../dtos/hiring-response.dto';
import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { HiringUpdateStatusRequestDto } from '../dtos/request/hiring.update-status.request.dto';
import {
  HiringDocParamsId,
  HiringDocQueryStatus,
} from '../constants/hiring-doc.constants';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';

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
    DocResponsePaging<HiringResponseDto>('hiring.list', {
      dto: HiringResponseDto,
    }),
  );
}

export function HiringAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new hiring',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: HiringCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<HiringResponseDto>('hiring.create', {
      dto: HiringResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function HiringAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update a hiring' }),
    DocRequest({
      params: HiringDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
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
      bodyType: EnumDocRequestBodyType.json,
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
    DocResponse<HiringResponseDto>('hiring.getById', {
      dto: HiringResponseDto,
    }),
  );
}
