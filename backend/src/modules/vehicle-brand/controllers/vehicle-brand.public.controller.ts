import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleBrandService } from '../services/vehicle-brand.service';
import {
  VehicleBrandPublicListDoc,
  VehicleBrandPublicGetOneDoc,
} from '../docs/vehicle-brand.public.doc';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { VehicleBrandGetResponseDto } from '../dtos/response/vehicle-brand.get.response.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_BRAND_DEFAULT_STATUS,
} from '../constants/vehicle-brand.list.constant';

@ApiTags('module.public.vehicle-brand')
@Controller({
  version: '1',
  path: '/vehicle-brand',
})
export class VehicleBrandPublicController {
  constructor(
    private readonly VehicleBrandService: VehicleBrandService,
    private readonly paginationService: PaginationService,
  ) {}

  @VehicleBrandPublicGetOneDoc()
  @Response('vehicle-brand.get')
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<VehicleBrandGetResponseDto>> {
    const VehicleBrand = await this.VehicleBrandService.findBySlug(slug);
    if (!VehicleBrand) {
      throw new NotFoundException({
        message: 'vehicle-brand.error.notFound',
      });
    }
    const mapped = this.VehicleBrandService.mapGet(VehicleBrand);
    return { data: mapped };
  }

  @VehicleBrandPublicListDoc()
  @ResponsePaging('vehicle-brand.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_BRAND_DEFAULT_STATUS,
      ENUM_VEHICLE_BRAND_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<VehicleBrandListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const VehicleBrands = await this.VehicleBrandService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.VehicleBrandService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.VehicleBrandService.mapList(VehicleBrands);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
