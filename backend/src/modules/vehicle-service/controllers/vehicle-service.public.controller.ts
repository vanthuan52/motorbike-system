import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleServiceService } from '../services/vehicle-service.service';
import {
  VehicleServicePublicGetOneDoc,
  VehicleServicePublicListDoc,
} from '../docs/vehicle-service.public.doc';
import {
  IResponsePagingReturn,
  IResponseReturn,
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
  VehicleServiceDefaultAvailableOrderBy,
  VehicleServiceDefaultAvailableSearch,
  VehicleServiceDefaultStatus,
} from '../constants/vehicle-service.list.constant';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { VehicleServiceUtil } from '../utils/vehicle-service.util';
import { IVehicleServiceListFilters } from '../interfaces/vehicle-service.filter.interface';
import { Prisma } from '@/generated/prisma-client';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';

@ApiTags('modules.public.vehicle-service')
@Controller({
  version: '1',
  path: '/vehicle-service',
})
export class VehicleServicePublicController {
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly vehicleServiceUtil: VehicleServiceUtil
  ) {}

  @VehicleServicePublicGetOneDoc()
  @Response('vehicle-service.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string
  ): Promise<IResponseReturn<VehicleServiceDto>> {
    const vehicleService = await this.vehicleServiceService.findBySlug(slug);
    const mapped = this.vehicleServiceUtil.mapOne(vehicleService);
    return { data: mapped };
  }

  @VehicleServicePublicListDoc()
  @ResponsePaging('vehicle-service.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VehicleServiceDefaultAvailableSearch,
      availableOrderBy: VehicleServiceDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VehicleServiceDefaultStatus)
    status: Record<string, any>,
    @Query('serviceCategory', RequestOptionalParseObjectIdPipe)
    serviceCategoryId?: string
  ): Promise<IResponsePagingReturn<VehicleServiceListResponseDto>> {
    const filters: IVehicleServiceListFilters = {
      ...status,
    };

    if (serviceCategoryId) {
      filters['serviceCategoryId'] = serviceCategoryId; // mapped to Prisma
    }

    const result = await this.vehicleServiceService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.vehicleServiceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
