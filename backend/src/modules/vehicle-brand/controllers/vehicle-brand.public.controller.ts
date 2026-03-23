import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleBrandService } from '../services/vehicle-brand.service';
import {
  VehicleBrandPublicListDoc,
  VehicleBrandPublicGetOneDoc,
} from '../docs/vehicle-brand.public.doc';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';
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
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import {
  VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_BRAND_DEFAULT_STATUS,
} from '../constants/vehicle-brand.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';

import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.public.vehicle-brand')
@Controller({
  version: '1',
  path: '/vehicle-brand',
})
export class VehicleBrandPublicController {
  constructor(
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleBrandUtil: VehicleBrandUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @VehicleBrandPublicGetOneDoc()
  @Response('vehicle-brand.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string,
  ): Promise<IResponseReturn<VehicleBrandDto>> {
    const vehicleBrand = await this.vehicleBrandService.findBySlug(slug);
    const mapped = this.vehicleBrandUtil.mapGet(vehicleBrand);
    return { data: mapped };
  }

  @VehicleBrandPublicListDoc()
  @ResponsePaging('vehicle-brand.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VEHICLE_BRAND_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<VehicleBrandListResponseDto>> {
    const { data, total } = await this.vehicleBrandService.getListOffset(
      pagination,
      status,
    );
    const mapped = this.vehicleBrandUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }
}
