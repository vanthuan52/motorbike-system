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
  VehicleModelDefaultAvailableOrderBy,
  VehicleModelDefaultAvailableSearch,
  VehicleModelDefaultFuelType,
  VehicleModelDefaultStatus,
  VehicleModelDefaultType,
} from '../constants/vehicle-model.list.constant';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { IVehicleModelListFilters } from '../interfaces/vehicle-model.filter.interface';
import { VehicleModelUtil } from '../utils/vehicle-model.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.public.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class VehicleModelPublicController {
  constructor(
    private readonly vehicleModelService: VehicleModelService,
    private readonly vehicleModelUtil: VehicleModelUtil
  ) {}

  @VehicleModelPublicGetOneDoc()
  @Response('vehicle-model.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string
  ): Promise<IResponseReturn<VehicleModelDto>> {
    const vehicleModel = await this.vehicleModelService.findBySlug(slug);
    const mapped = this.vehicleModelUtil.mapOne(vehicleModel);
    return { data: mapped };
  }

  @VehicleModelPublicListDoc()
  @ResponsePaging('vehicle-model.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VehicleModelDefaultAvailableSearch,
      availableOrderBy: VehicleModelDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VehicleModelDefaultStatus)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('type', VehicleModelDefaultType)
    type: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('fuelType', VehicleModelDefaultFuelType)
    fuelType: Record<string, IPaginationIn>,
    @Query('vehicleBrand')
    vehicleBrandId?: string,
    @Query('engineDisplacement')
    engineDisplacement?: number,
    @Query('modelYear')
    modelYear?: number
  ): Promise<IResponsePagingReturn<VehicleModelListResponseDto>> {
    const filters: IVehicleModelListFilters = {
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
      filters['vehicleBrandId'] = vehicleBrandId;
    }

    const result = await this.vehicleModelService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.vehicleModelUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
