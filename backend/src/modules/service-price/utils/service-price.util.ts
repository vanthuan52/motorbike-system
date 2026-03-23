import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ServicePrice } from '@/generated/prisma-client';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceDto } from '../dtos/service-price.dto';

@Injectable()
export class ServicePriceUtil {
  mapList(servicePrices: ServicePrice[]): ServicePriceListResponseDto[] {
    return plainToInstance(ServicePriceListResponseDto, servicePrices);
  }

  mapGet(servicePrice: ServicePrice): ServicePriceDto {
    return plainToInstance(ServicePriceDto, servicePrice);
  }
}
