import { HttpStatus, applyDecorators } from '@nestjs/common';
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
import { VehicleModelDto } from '../dtos/vehicle-model.dto';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
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
    })
  );
}

export function VehicleModelAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new vehicle model',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleModelCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('vehicle-model.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function VehicleModelAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a vehicle model',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleModelUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-model.update')
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
    DocResponse('vehicle-model.delete')
  );
}

export function VehicleModelAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a vehicle model',
    }),
    DocRequest({
      params: VehicleModelDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleModelUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-model.updateStatus')
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
    DocResponse<VehicleModelDto>('vehicle-model.getById', {
      dto: VehicleModelDto,
    })
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
    })
  );
}
