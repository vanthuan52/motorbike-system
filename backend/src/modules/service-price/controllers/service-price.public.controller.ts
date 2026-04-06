import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicePriceService } from '../services/service-price.services';
import { ServicePricePublicListDoc } from '../docs/service-price.public.doc';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import {
  ServicePriceDefaultAvailableOrderBy,
  ServicePriceDefaultAvailableSearch,
} from '../constants/service-price.list.constant';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { ServicePriceUtil } from '../utils/service-price.util';
import { IServicePriceListFilters } from '../interfaces/service-price.filter.interface';

@ApiTags('modules.public.service-price')
@Controller({
  version: '1',
  path: '/service-price',
})
export class ServicePricePublicController {
  constructor(
    private readonly servicePriceService: ServicePriceService,
    private readonly servicePriceUtil: ServicePriceUtil
  ) {}

  @ServicePricePublicListDoc()
  @ResponsePaging('service-price.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ServicePriceDefaultAvailableSearch,
      availableOrderBy: ServicePriceDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('vehicleService', RequestOptionalParseObjectIdPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', RequestOptionalParseObjectIdPipe)
    vehicleModelId: string
  ): Promise<IResponsePagingReturn<ServicePriceListResponseDto>> {
    const filters: IServicePriceListFilters = {};

    if (vehicleServiceId) {
      filters['vehicleService'] = vehicleServiceId;
    }

    if (vehicleModelId) {
      filters['vehicleModel'] = vehicleModelId;
    }

    const result = await this.servicePriceService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.servicePriceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
