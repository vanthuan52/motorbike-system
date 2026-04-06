import { PartialType } from '@nestjs/swagger';
import { ServicePriceCreateRequestDto } from './service-price.create.request.dto';

export class ServicePriceUpdateRequestDto extends PartialType(
  ServicePriceCreateRequestDto
) {}
