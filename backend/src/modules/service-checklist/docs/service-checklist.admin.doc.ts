import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  ServiceChecklistDocParamsId,
  ServiceChecklistDocQueryArea,
  ServiceChecklistDocQueryOrderBy,
  ServiceChecklistDocQueryOrderDirection,
} from '../constants/service-checklist.doc.constant';
import { ServiceChecklistGetResponseDto } from '../dtos/response/service-checklist.get.response.dto';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';

export function ServiceChecklistAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service checklist',
    }),
    DocRequest({
      queries: [
        ...ServiceChecklistDocQueryArea,
        ...ServiceChecklistDocQueryOrderBy,
        ...ServiceChecklistDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ServiceChecklistListResponseDto>(
      'service-checklist.list',
      {
        dto: ServiceChecklistListResponseDto,
      },
    ),
  );
}

export function ServiceChecklistAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new service checklist',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ServiceChecklistCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceChecklistGetResponseDto>('service-checklist.create', {
      dto: ServiceChecklistGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function ServiceChecklistAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a service checklist',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ServiceChecklistUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.update'),
  );
}

export function ServiceChecklistAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a service checklist',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.delete'),
  );
}

export function ServiceChecklistAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a service checklist by id',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceChecklistGetResponseDto>('service-checklist.getById', {
      dto: ServiceChecklistGetResponseDto,
    }),
  );
}
