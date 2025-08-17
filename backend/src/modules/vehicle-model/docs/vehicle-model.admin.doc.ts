import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  VehicleModelDocParamsId,
  VehicleModelDocQueryEngineDisplacement,
  VehicleModelDocQueryFuelType,
  VehicleModelDocQueryModelYear,
  VehicleModelDocQueryOrderBy,
  VehicleModelDocQueryOrderDirection,
  VehicleModelDocQueryStatus,
  VehicleModelDocQueryType,
  VehicleModelDocQueryVehicleBrand,
} from '../constants/vehicle-model.doc.constant';
import { VehicleModelGetResponseDto } from '../dtos/response/vehicle-model.get.response.dto';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { VehicleModelGetFullResponseDto } from '../dtos/response/vehicle-model.full.response.dto';

export function VehicleModelAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all vehicle models',
    }),
    DocRequest({
      queries: [
        ...VehicleModelDocQueryVehicleBrand,
        ...VehicleModelDocQueryStatus,
        ...VehicleModelDocQueryType,
        ...VehicleModelDocQueryFuelType,
        ...VehicleModelDocQueryOrderBy,
        ...VehicleModelDocQueryOrderDirection,
        ...VehicleModelDocQueryEngineDisplacement,
        ...VehicleModelDocQueryModelYear,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<VehicleModelListResponseDto>('vehicle-model.list', {
      dto: VehicleModelListResponseDto,
    }),
  );
}

export function VehicleModelAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new vehicle model',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleModelCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('vehicle-model.create', {
      dto: DatabaseIdResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function VehicleModelAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a vehicle model',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleModelUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-model.update'),
  );
}

export function VehicleModelAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a vehicle model',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-model.delete'),
  );
}

export function VehicleModelAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a vehicle model',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleModelUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-model.updateStatus'),
  );
}

export function VehicleModelAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a vehicle model by id',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleModelGetResponseDto>('vehicle-model.getById', {
      dto: VehicleModelGetResponseDto,
    }),
  );
}

export function VehicleModelAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a vehicle model',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleModelGetFullResponseDto>('vehicle-model.get', {
      dto: VehicleModelGetFullResponseDto,
    }),
  );
}
