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
  MaintenanceScheduleDocParamsId,
  MaintenanceScheduleDocQueryCategory,
  MaintenanceScheduleDocQueryOrderBy,
  MaintenanceScheduleDocQueryOrderDirection,
  MaintenanceScheduleDocQueryStatus,
} from '../constants/maintenance-schedule.doc.constant';
import { MaintenanceScheduleListResponseDto } from '../dtos/response/maintenance-schedule.list.response.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { MaintenanceScheduleUpdateRequestDto } from '../dtos/request/maintenance-schedule.update.request.dto';
import { MaintenanceScheduleCreateRequestDto } from '../dtos/request/maintenance-schedule.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { MaintenanceScheduleGetFullResponseDto } from '../dtos/response/maintenance-schedule.full.response.dto';

export function MaintenanceScheduleAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all maintenance schedules',
    }),
    DocRequest({
      queries: [
        ...MaintenanceScheduleDocQueryCategory,
        ...MaintenanceScheduleDocQueryStatus,
        ...MaintenanceScheduleDocQueryOrderBy,
        ...MaintenanceScheduleDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<MaintenanceScheduleListResponseDto>(
      'maintenance-schedule.list',
      {
        dto: MaintenanceScheduleListResponseDto,
      },
    ),
  );
}

export function MaintenanceScheduleAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get maintenance schedule by id',
    }),
    DocRequest({
      params: MaintenanceScheduleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<MaintenanceScheduleGetFullResponseDto>(
      'maintenance-schedule.getById',
      {
        dto: MaintenanceScheduleGetFullResponseDto,
      },
    ),
  );
}

export function MaintenanceScheduleAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create maintenance schedule',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: MaintenanceScheduleCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('maintenance-schedule.create', {
      dto: MaintenanceScheduleListResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function MaintenanceScheduleAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update maintenance schedule',
    }),
    DocRequest({
      params: MaintenanceScheduleDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: MaintenanceScheduleUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('maintenance-schedule.update'),
  );
}

export function MaintenanceScheduleAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete maintenance schedule',
    }),
    DocRequest({
      params: MaintenanceScheduleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('maintenance-schedule.delete'),
  );
}

export function MaintenanceScheduleAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status maintenance schedule by id',
    }),
    DocRequest({
      params: MaintenanceScheduleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('maintenance-schedule.updateStatus'),
  );
}
