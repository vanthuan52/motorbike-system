import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { ServicePriceDoc } from '../entities/service-price.entity';
import { IServicePriceEntity } from '../interfaces/service-price.interface';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceDto } from '../dtos/service-price.dto';

@Injectable()
export class ServicePriceUtil {
  mapList(
    servicePrices: ServicePriceDoc[] | IServicePriceEntity[],
  ): ServicePriceListResponseDto[] {
    return plainToInstance(
      ServicePriceListResponseDto,
      servicePrices.map((c: ServicePriceDoc | IServicePriceEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(servicePrice: ServicePriceDoc | IServicePriceEntity): ServicePriceDto {
    return plainToInstance(
      ServicePriceDto,
      servicePrice instanceof Document ? servicePrice.toObject() : servicePrice,
    );
  }
}
