import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleModelDto } from '../vehicle-model.dto';
import { VehicleBrandDto } from '@/modules/vehicle-brand/dtos/vehicle-brand.dto';

export class VehicleModelGetFullResponseDto extends OmitType(VehicleModelDto, [
  'vehicleBrand',
] as const) {
  @ApiProperty({
    required: true,
    type: VehicleBrandDto,
    oneOf: [{ $ref: getSchemaPath(VehicleBrandDto) }],
  })
  @Type(() => VehicleBrandDto)
  vehicleBrand: VehicleBrandDto;
}
