import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  VehicleBrandDocParamsId,
  VehicleBrandDocQueryOrderBy,
  VehicleBrandDocQueryOrderDirection,
  VehicleBrandDocQueryStatus,
} from '../constants/vehicle-brand.doc.constant';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';

export function VehicleAdminBrandListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all vehicle brands',
    }),
    DocRequest({
      queries: [
        ...VehicleBrandDocQueryStatus,
        ...VehicleBrandDocQueryOrderBy,
        ...VehicleBrandDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<VehicleBrandListResponseDto>('vehicle-brand.list', {
      dto: VehicleBrandListResponseDto,
    }),
  );
}

export function VehicleAdminBrandCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new vehicle brand',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleBrandCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleBrandDto>('vehicle-brand.create', {
      dto: VehicleBrandDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function VehicleAdminBrandUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a vehicle brand',
    }),
    DocRequest({
      params: VehicleBrandDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleBrandUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-brand.update'),
  );
}

export function VehicleAdminBrandDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a vehicle brand',
    }),
    DocRequest({
      params: VehicleBrandDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-brand.delete'),
  );
}

export function VehicleAdminBrandUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a vehicle brand',
    }),
    DocRequest({
      params: VehicleBrandDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleBrandUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-brand.updateStatus'),
  );
}

export function VehicleAdminBrandParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a vehicle brand by id',
    }),
    DocRequest({
      params: VehicleBrandDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleBrandDto>('vehicle-brand.getById', {
      dto: VehicleBrandDto,
    }),
  );
}
