import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordDto } from '../dtos/care-record.dto';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  CareRecordDocParamsId,
  CareRecordDocQueryOrderBy,
  CareRecordDocQueryOrderDirection,
  CareRecordDocQueryStatus,
  CareRecordDocQueryPaymentStatus,
  CareRecordDocQueryTechnician,
  CareRecordDocQueryUserVehicle,
  CareRecordDocQueryAppointment,
} from '../constants/care-record.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';

export function CareRecordAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care records',
    }),
    DocRequest({
      queries: [
        ...CareRecordDocQueryAppointment,
        ...CareRecordDocQueryPaymentStatus,
        ...CareRecordDocQueryTechnician,
        ...CareRecordDocQueryUserVehicle,
        ...CareRecordDocQueryStatus,
        ...CareRecordDocQueryOrderBy,
        ...CareRecordDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordListResponseDto>('care-record.list', {
      dto: CareRecordListResponseDto,
    }),
  );
}

export function CareRecordAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordDto>('care-record.create', {
      dto: CareRecordDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.update'),
  );
}

export function CareRecordAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.delete'),
  );
}

export function CareRecordAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record by id',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordDto>('care-record.getById', {
      dto: CareRecordDto,
    }),
  );
}

export function CareRecordAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a care record',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetFullResponseDto>('care-record.get', {
      dto: CareRecordGetFullResponseDto,
    }),
  );
}

export function CareRecordAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a care record',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updateStatus'),
  );
}

export function CareRecordAdminUpdatePaymentStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update the payment status of a care record',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordUpdatePaymentStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updatePaymentStatus'),
  );
}

export function CareRecordAdminUpdateTechnicianDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'assign a technician',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordUpdateTechnicianRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updateTechnician'),
  );
}

export function CareRecordAdminCreateChecklistDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new checklist',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordDto>('care-record.createChecklist', {
      dto: CareRecordDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordAdminTrashListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all trashed care records',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordListResponseDto>('care-record.trashList', {
      dto: CareRecordListResponseDto,
    }),
  );
}

export function CareRecordAdminRestoreDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'restore a soft-deleted care record from trash',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.restore'),
  );
}

export function CareRecordAdminForceDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'permanently delete a care record (irreversible)',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.forceDelete'),
  );
}
