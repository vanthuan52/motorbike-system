import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleModelGetResponseDto } from './vehicle-model.get.response.dto';
import { VehicleBrandGetResponseDto } from '@/modules/vehicle-brand/dtos/response/vehicle-brand.get.response.dto';

export class VehicleModelGetFullResponseDto extends OmitType(
  VehicleModelGetResponseDto,
  ['vehicleBrand'] as const,
) {
  @ApiProperty({
    required: true,
    type: VehicleBrandGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleBrandGetResponseDto) }],
  })
  @Type(() => VehicleBrandGetResponseDto)
  vehicleBrand: VehicleBrandGetResponseDto;
}
