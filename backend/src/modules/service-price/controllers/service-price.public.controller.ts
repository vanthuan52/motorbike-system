import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicePriceService } from '../services/service-price.services';
import { ServicePricePublicListDoc } from '../docs/service-price.public.doc';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY } from '../constants/service-price.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';

@ApiTags('modules.public.service-price')
@Controller({
  version: '1',
  path: '/service-price',
})
export class ServicePricePublicController {
  constructor(
    private readonly servicePriceService: ServicePriceService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServicePricePublicListDoc()
  @ResponsePaging('service-price.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleService', OptionalParseUUIDPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', OptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<ServicePriceListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (vehicleServiceId) {
      find['vehicleService'] = vehicleServiceId;
    }

    if (vehicleModelId) {
      find['vehicleModel'] = vehicleModelId;
    }

    const servicePrices =
      await this.servicePriceService.findAllWithVehicleServiceAndVehicleModel(
        find,
        {
          paging: {
            limit: _limit,
            offset: _offset,
          },
          order: _order,
        },
      );

    const total: number =
      await this.servicePriceService.getTotalWithVehicleServiceAndVehicleModel(
        find,
      );

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.servicePriceService.mapList(servicePrices);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
