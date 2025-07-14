import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  AppointmentsDocParamsId,
  AppointmentsDocQueryOrderBy,
  AppointmentsDocQueryOrderDirection,
  AppointmentsDocQueryStatus,
} from '../constants/appointment.doc.constant';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';

export function AppointmentsAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all maintenance schedules',
    }),
    DocRequest({
      queries: [
        ...AppointmentsDocQueryStatus,
        ...AppointmentsDocQueryOrderBy,
        ...AppointmentsDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<AppointmentListResponseDto>('appointment.list', {
      dto: AppointmentListResponseDto,
    }),
  );
}

export function AppointmentsAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get maintenance schedule by id',
    }),
    DocRequest({
      params: AppointmentsDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<AppointmentGetFullResponseDto>('appointment.getById', {
      dto: AppointmentGetFullResponseDto,
    }),
  );
}

export function AppointmentsAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create maintenance schedule',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AppointmentCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('appointment.create', {
      dto: AppointmentListResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function AppointmentsAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update maintenance schedule',
    }),
    DocRequest({
      params: AppointmentsDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AppointmentUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('appointment.update'),
  );
}

export function AppointmentsAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete maintenance schedule',
    }),
    DocRequest({
      params: AppointmentsDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('appointment.delete'),
  );
}

export function AppointmentsAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status maintenance schedule by id',
    }),
    DocRequest({
      params: AppointmentsDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('appointment.updateStatus'),
  );
}
