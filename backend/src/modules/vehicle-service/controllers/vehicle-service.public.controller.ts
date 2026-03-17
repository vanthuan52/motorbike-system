import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleServiceService } from '../services/vehicle-service.service';
import {
  VehicleServicePublicListDoc,
  VehicleServicePublicGetOneDoc,
} from '../docs/vehicle-service.public.doc';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import {
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_SERVICE_DEFAULT_STATUS,
} from '../constants/vehicle-service.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';

@ApiTags('modules.public.vehicle-service')
@Controller({
  version: '1',
  path: '/vehicle-service',
})
export class VehicleServicePublicController {
  constructor(private readonly vehicleServiceService: VehicleServiceService) {}

  @VehicleServicePublicGetOneDoc()
  @Response('vehicle-service.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string,
  ): Promise<IResponseReturn<VehicleServiceDto>> {
    return this.vehicleServiceService.findBySlug(slug);
  }

  @VehicleServicePublicListDoc()
  @ResponsePaging('vehicle-service.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', VEHICLE_SERVICE_DEFAULT_STATUS)
    status: Record<string, any>,
    @Query('serviceCategory', OptionalParseUUIDPipe)
    serviceCategoryId?: string,
  ): Promise<IResponsePagingReturn<VehicleServiceListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
    };

    if (serviceCategoryId) {
      filters['serviceCategory'] = serviceCategoryId;
    }

    return this.vehicleServiceService.getListOffset(pagination, filters);
  }
}
