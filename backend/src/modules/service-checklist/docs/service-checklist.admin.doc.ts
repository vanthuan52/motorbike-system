import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistDocParamsId } from '../constants/service-checklist.doc.constant';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';

export function ServiceChecklistAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service checklists',
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

export function ServiceChecklistAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get service checklist by id',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceChecklistDto>('service-checklist.get', {
      dto: ServiceChecklistDto,
    }),
  );
}

export function ServiceChecklistAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a service checklist',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: ServiceChecklistCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceChecklistDto>('service-checklist.create', {
      dto: ServiceChecklistDto,
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
      bodyType: EnumDocRequestBodyType.json,
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
