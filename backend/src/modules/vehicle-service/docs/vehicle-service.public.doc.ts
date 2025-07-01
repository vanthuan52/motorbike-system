import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  VehicleServiceDocParamsSlug,
  VehicleServiceDocQueryCategory,
  VehicleServiceDocQueryOrderBy,
  VehicleServiceDocQueryOrderDirection,
  VehicleServiceDocQueryStatus,
} from '../constants/vehicle-service.doc.constant';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceFullResponseDto } from '../dtos/response/vehicle-service.full.response.dto';

export function VehicleServicePublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one vehicle service by slug',
    }),
    DocRequest({
      params: VehicleServiceDocParamsSlug,
    }),
    DocResponse<VehicleServiceFullResponseDto>('vehicle-service.get', {
      dto: VehicleServiceFullResponseDto,
    }),
  );
}

export function VehicleServicePublicListDoc(): MethodDecorator {
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
    DocResponsePaging<VehicleServiceListResponseDto>('vehicle-service.list', {
      dto: VehicleServiceListResponseDto,
    }),
  );
}
