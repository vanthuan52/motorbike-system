import { applyDecorators } from '@nestjs/common';

import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import {
  ServicePriceDocQueryOrderBy,
  ServicePriceDocQueryOrderDirection,
  ServicePriceDocQueryStatus,
  ServicePriceDocQueryVehicleModel,
  ServicePriceDocQueryVehicleService,
} from '../constants/service-price.doc.constant';
import {
  Doc,
  DocRequest,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';

export function ServicePricePublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all ServicePrice',
    }),
    DocRequest({
      queries: [
        ...ServicePriceDocQueryVehicleModel,
        ...ServicePriceDocQueryVehicleService,
        ...ServicePriceDocQueryStatus,
        ...ServicePriceDocQueryOrderBy,
        ...ServicePriceDocQueryOrderDirection,
      ],
    }),
    DocResponsePaging<ServicePriceListResponseDto>('ServicePrice.list', {
      dto: ServicePriceListResponseDto,
    })
  );
}
