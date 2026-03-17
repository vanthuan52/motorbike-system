import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleModelService } from '../services/vehicle-model.service';
import {
  VehicleModelPublicListDoc,
  VehicleModelPublicGetOneDoc,
} from '../docs/vehicle-model.public.doc';
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
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import {
  VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_MODEL_DEFAULT_FUEL_TYPE,
  VEHICLE_MODEL_DEFAULT_STATUS,
  VEHICLE_MODEL_DEFAULT_TYPE,
} from '../constants/vehicle-model.list.constant';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';

import { VehicleModelUtil } from '../utils/vehicle-model.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.public.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class VehicleModelPublicController {
  constructor(
    private readonly vehicleModelService: VehicleModelService,
    private readonly vehicleModelUtil: VehicleModelUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @VehicleModelPublicGetOneDoc()
  @Response('vehicle-model.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string,
  ): Promise<IResponseReturn<VehicleModelDto>> {
    const vehicleModel = await this.vehicleModelService.findBySlug(slug);
    const mapped = this.vehicleModelUtil.mapGet(vehicleModel);
    return { data: mapped };
  }

  @VehicleModelPublicListDoc()
  @ResponsePaging('vehicle-model.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', VEHICLE_MODEL_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('type', VEHICLE_MODEL_DEFAULT_TYPE)
    type: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('fuelType', VEHICLE_MODEL_DEFAULT_FUEL_TYPE)
    fuelType: Record<string, IPaginationIn>,
    @Query('vehicleBrand')
    vehicleBrandId?: string,
    @Query('engineDisplacement')
    engineDisplacement?: number,
    @Query('modelYear')
    modelYear?: number,
  ): Promise<IResponsePagingReturn<VehicleModelListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
      ...type,
      ...fuelType,
    };

    if (modelYear !== undefined) {
      filters['modelYear'] = modelYear;
    }
    if (engineDisplacement !== undefined) {
      filters['engineDisplacement'] = engineDisplacement;
    }
    if (vehicleBrandId) {
      filters['vehicleBrand'] = vehicleBrandId;
    }

    const { data, total } = await this.vehicleModelService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.vehicleModelUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }
}
