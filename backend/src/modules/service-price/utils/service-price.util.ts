import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ServicePriceModel } from '../models/service-price.model';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceDto } from '../dtos/service-price.dto';

@Injectable()
export class ServicePriceUtil {
  mapList(servicePrices: ServicePriceModel[]): ServicePriceListResponseDto[] {
    return plainToInstance(ServicePriceListResponseDto, servicePrices);
  }

  mapGet(servicePrice: ServicePriceModel): ServicePriceDto {
    return plainToInstance(ServicePriceDto, servicePrice);
  }
}
