import {
  Controller,
  Get,
  NotFoundException,
  Optional,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleServiceService } from '../services/vehicle-service.service';
import {
  VehicleServicePublicListDoc,
  VehicleServicePublicGetOneDoc,
} from '../docs/vehicle-service.public.doc';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../enums/vehicle-service.enum';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_SERVICE_DEFAULT_STATUS,
} from '../constants/vehicle-service.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleServiceDoc } from '../entities/vehicle-service.entity';
import { VehicleServiceGetFullResponseDto } from '../dtos/response/vehicle-service.full.response.dto';
import { IVehicleServiceDoc } from '../interfaces/vehicle-service.interface';

@ApiTags('modules.public.vehicle-service')
@Controller({
  version: '1',
  path: '/vehicle-service',
})
export class VehicleServicePublicController {
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly paginationService: PaginationService,
  ) {}

  @VehicleServicePublicGetOneDoc()
  @Response('vehicle-service.get')
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<VehicleServiceGetFullResponseDto>> {
    const vehicleService: VehicleServiceDoc | null =
      await this.vehicleServiceService.findBySlug(slug);

    if (!vehicleService) {
      throw new NotFoundException({
        message: 'vehicle-service.error.notFound',
      });
    }
    const userWithRole: IVehicleServiceDoc =
      await this.vehicleServiceService.join(vehicleService);
    const mapped: VehicleServiceGetFullResponseDto =
      this.vehicleServiceService.mapGetPopulate(vehicleService);
    return { data: mapped };
  }

  @VehicleServicePublicListDoc()
  @ResponsePaging('vehicle-service.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_SERVICE_DEFAULT_STATUS,
      ENUM_VEHICLE_SERVICE_STATUS,
    )
    status: Record<string, any>,
    @Query('serviceCategory', OptionalParseUUIDPipe)
    serviceCategoryId?: string,
  ): Promise<IResponsePaging<VehicleServiceListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (serviceCategoryId) {
      find['serviceCategory._id'] = serviceCategoryId;
    }

    const vehicleServices =
      await this.vehicleServiceService.findAllWithServiceCategory(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.vehicleServiceService.getTotalWithServiceCategory(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.vehicleServiceService.mapList(vehicleServices);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
