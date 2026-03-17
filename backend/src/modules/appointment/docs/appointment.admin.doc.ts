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
  AppointmentDocParamsId,
  AppointmentDocQueryOrderBy,
  AppointmentDocQueryOrderDirection,
  AppointmentDocQueryStatus,
} from '../constants/appointment.doc.constant';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';

export function AppointmentAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all appointments',
    }),
    DocRequest({
      queries: [
        ...AppointmentDocQueryStatus,
        ...AppointmentDocQueryOrderBy,
        ...AppointmentDocQueryOrderDirection,
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

export function AppointmentAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get appointment by id',
    }),
    DocRequest({
      params: AppointmentDocParamsId,
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

export function AppointmentAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create appointment',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AppointmentCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('appointment.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function AppointmentAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update appointment',
    }),
    DocRequest({
      params: AppointmentDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: AppointmentUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('appointment.update'),
  );
}

export function AppointmentAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete appointment',
    }),
    DocRequest({
      params: AppointmentDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('appointment.delete'),
  );
}

export function AppointmentAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status appointment by id',
    }),
    DocRequest({
      params: AppointmentDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('appointment.updateStatus'),
  );
}
