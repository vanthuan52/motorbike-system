import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  VehicleServiceDocParamsId,
  VehicleServiceDocQueryCategory,
  VehicleServiceDocQueryOrderBy,
  VehicleServiceDocQueryOrderDirection,
  VehicleServiceDocQueryStatus,
} from '../constants/vehicle-service.doc.constant';
import { VehicleServiceGetResponseDto } from '../dtos/response/vehicle-service.get.response.dto';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { VehicleServiceFullResponseDto } from '../dtos/response/vehicle-service.full.response.dto';

export function VehicleServiceAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all vehicle services',
    }),
    DocRequest({
      queries: [
        ...VehicleServiceDocQueryCategory,
        ...VehicleServiceDocQueryStatus,
        ...VehicleServiceDocQueryOrderBy,
        ...VehicleServiceDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<VehicleServiceListResponseDto>('vehicle-service.list', {
      dto: VehicleServiceListResponseDto,
    }),
  );
}

export function VehicleServiceAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new vehicle service',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleServiceCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('vehicle-service.create', {
      dto: DatabaseIdResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function VehicleServiceAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a vehicle service',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleServiceUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-service.update'),
  );
}

export function VehicleServiceAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a vehicle service',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-service.delete'),
  );
}

export function VehicleServiceAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a vehicle service',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleServiceUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-service.updateStatus'),
  );
}

export function VehicleServiceAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a vehicle service by id',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleServiceGetResponseDto>('vehicle-service.getById', {
      dto: VehicleServiceGetResponseDto,
    }),
  );
}

export function VehicleServiceAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a vehicle',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleServiceFullResponseDto>('vehicle-service.get', {
      dto: VehicleServiceFullResponseDto,
    }),
  );
}
