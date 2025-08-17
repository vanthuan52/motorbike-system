import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleModelService } from '../services/vehicle-model.service';
import {
  VehicleModelPublicListDoc,
  VehicleModelPublicGetOneDoc,
} from '../docs/vehicle-model.public.doc';
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
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../enums/vehicle-model.enum';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_MODEL_DEFAULT_FUEL_TYPE,
  VEHICLE_MODEL_DEFAULT_STATUS,
  VEHICLE_MODEL_DEFAULT_TYPE,
} from '../constants/vehicle-model.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleModelDoc } from '../entities/vehicle-model.entity';
import { VehicleModelGetFullResponseDto } from '../dtos/response/vehicle-model.full.response.dto';
import { OptionalParseIntPipe } from '@/app/pipes/optional-parse-int.pipe';

@ApiTags('modules.public.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class VehicleModelPublicController {
  constructor(
    private readonly vehicleModelService: VehicleModelService,
    private readonly paginationService: PaginationService,
  ) {}

  @VehicleModelPublicGetOneDoc()
  @Response('vehicle-model.get')
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<VehicleModelGetFullResponseDto>> {
    const vehicleModel: VehicleModelDoc | null =
      await this.vehicleModelService.findBySlug(slug);

    if (!vehicleModel) {
      throw new NotFoundException({
        message: 'vehicle-model.error.notFound',
      });
    }

    const partFull = await this.vehicleModelService.join(vehicleModel);

    const mapped: VehicleModelGetFullResponseDto =
      this.vehicleModelService.mapGetPopulate(partFull);
    return { data: mapped };
  }

  @VehicleModelPublicListDoc()
  @ResponsePaging('vehicle-model.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_MODEL_DEFAULT_STATUS,
      ENUM_VEHICLE_MODEL_STATUS,
    )
    status: Record<string, any>,
    @PaginationQueryFilterInEnum(
      'type',
      VEHICLE_MODEL_DEFAULT_TYPE,
      ENUM_VEHICLE_MODEL_TYPE,
    )
    type: Record<string, any>,
    @PaginationQueryFilterInEnum(
      'fuelType',
      VEHICLE_MODEL_DEFAULT_FUEL_TYPE,
      ENUM_VEHICLE_MODEL_FUEL_TYPE,
    )
    fuelType: Record<string, any>,
    @Query('vehicleBrand', OptionalParseUUIDPipe)
    vehicleBrandId?: string,
    @Query('engineDisplacement', OptionalParseIntPipe)
    engineDisplacement?: number,
    @Query('modelYear', OptionalParseIntPipe)
    modelYear?: number,
  ): Promise<IResponsePaging<VehicleModelListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
      ...type,
      ...fuelType,
    };

    if (modelYear !== undefined) {
      find['modelYear'] = modelYear;
    }
    if (engineDisplacement !== undefined) {
      find['engineDisplacement'] = engineDisplacement;
    }

    if (vehicleBrandId) {
      find['vehicleBrand._id'] = vehicleBrandId;
    }

    const vehicleModels =
      await this.vehicleModelService.findAllWithVehicleBrand(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.vehicleModelService.getTotalWithVehicleBrand(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.vehicleModelService.mapList(vehicleModels);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
