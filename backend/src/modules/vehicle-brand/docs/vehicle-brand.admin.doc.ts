import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  VehicleBrandDocParamsId,
  VehicleBrandDocQueryOrderBy,
  VehicleBrandDocQueryOrderDirection,
  VehicleBrandDocQueryStatus,
} from '../constants/vehicle-brand.doc.constant';
import { VehicleBrandGetResponseDto } from '../dtos/response/vehicle-brand.get.response.dto';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';

export function VehicleBrandAdminListDoc(): MethodDecorator {
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

export function VehicleBrandAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new vehicle brand',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleBrandCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleBrandGetResponseDto>('vehicle-brand.create', {
      dto: VehicleBrandGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function VehicleBrandAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a vehicle brand',
    }),
    DocRequest({
      params: VehicleBrandDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleBrandUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-brand.update'),
  );
}

export function VehicleBrandAdminDeleteDoc(): MethodDecorator {
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

export function VehicleBrandAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a vehicle brand',
    }),
    DocRequest({
      params: VehicleBrandDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: VehicleBrandUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-brand.updateStatus'),
  );
}

export function VehicleBrandAdminParamsIdDoc(): MethodDecorator {
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
    DocResponse<VehicleBrandGetResponseDto>('vehicle-brand.getById', {
      dto: VehicleBrandGetResponseDto,
    }),
  );
}
