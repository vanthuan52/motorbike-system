import { ApiProperty } from '@nestjs/swagger';
import { ServicePriceGetFullResponseDto } from './service-price.full.response.dto';
import { ENUM_SERVICE_PRICE_STATUS } from '../../enums/service-price.enum';

export class ServicePriceListResponseDto extends ServicePriceGetFullResponseDto {}

export class ModelServicePriceListResponseDto {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  _id: string | null;

  @ApiProperty({
    required: true,
  })
  servicePriceId: string;

  @ApiProperty({
    required: true,
  })
  vehicleServiceId: string;

  @ApiProperty({
    required: true,
  })
  vehicleServiceName: string;

  @ApiProperty({
    required: true,
  })
  vehicleModelId: string;

  @ApiProperty({
    required: true,
  })
  vehicleModelName: string;

  @ApiProperty({
    required: true,
    enum: ENUM_SERVICE_PRICE_STATUS,
  })
  status: ENUM_SERVICE_PRICE_STATUS;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  price: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  dateStart: Date | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  dateEnd: Date | null;
}
