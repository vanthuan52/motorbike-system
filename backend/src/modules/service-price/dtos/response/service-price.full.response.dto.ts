import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ServicePriceDto } from '../service-price.dto';
import { VehicleModelDto } from '@/modules/vehicle-model/dtos/vehicle-model.dto';
import { VehicleServiceDto } from '@/modules/vehicle-service/dtos/vehicle-service.dto';

export class ServicePriceGetFullResponseDto extends OmitType(ServicePriceDto, [
  'vehicleModel',
  'vehicleService',
] as const) {
  @ApiProperty({
    required: true,
    type: VehicleModelDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelDto) }],
  })
  @Type(() => VehicleModelDto)
  vehicleModel: VehicleModelDto;

  @ApiProperty({
    required: true,
    type: VehicleServiceDto,
    oneOf: [{ $ref: getSchemaPath(VehicleServiceDto) }],
  })
  @Type(() => VehicleServiceDto)
  vehicleService: VehicleServiceDto;
}
