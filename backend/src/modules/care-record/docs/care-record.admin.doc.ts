import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
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
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
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
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetResponseDto>('care-record.create', {
      dto: CareRecordGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a service price',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
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
      summary: 'delete a service price',
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
      summary: 'get a service price by id',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetResponseDto>('care-record.getById', {
      dto: CareRecordGetResponseDto,
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
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
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
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
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
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
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
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetResponseDto>('care-record.createChecklist', {
      dto: CareRecordGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}
