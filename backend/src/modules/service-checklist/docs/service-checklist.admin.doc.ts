import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistDocParamsId } from '../constants/service-checklist.doc.constant';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
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
      }
    )
  );
}

export function ServiceChecklistAdminGetDoc(): MethodDecorator {
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
    })
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
    DocResponse<DatabaseIdDto>('service-checklist.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    })
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
    DocResponse('service-checklist.update')
  );
}

export function ServiceChecklistAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'soft-delete a service checklist',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.delete')
  );
}

export function ServiceChecklistAdminTrashListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all trashed service checklists',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ServiceChecklistListResponseDto>(
      'service-checklist.trashList',
      {
        dto: ServiceChecklistListResponseDto,
      }
    )
  );
}

export function ServiceChecklistAdminRestoreDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'restore a soft-deleted service checklist from trash',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.restore')
  );
}

export function ServiceChecklistAdminForceDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'permanently delete a service checklist (irreversible)',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-checklist.forceDelete')
  );
}
