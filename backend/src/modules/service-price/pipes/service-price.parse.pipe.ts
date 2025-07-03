import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ServicePriceService } from '../services/service-price.services';
import { ENUM_SERVICE_PRICE_STATUS_CODE_ERROR } from '../enums/service-price.status-code.enum';
import { ServicePriceDoc } from '../entities/service-price.entity';

@Injectable()
export class ServicePriceParsePipe implements PipeTransform {
  constructor(private readonly servicePriceService: ServicePriceService) {}

  async transform(value: any): Promise<ServicePriceDoc> {
    const servicePrice: ServicePriceDoc | null =
      await this.servicePriceService.findOneById(value);

    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }

    return servicePrice;
  }
}
