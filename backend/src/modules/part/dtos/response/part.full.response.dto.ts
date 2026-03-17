import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartDto } from '../part.dto';
import { PartTypeGetResponseDto } from '@/modules/part-type/dtos/response/part-type.get.response.dto';
import { VehicleBrandDto } from '@/modules/vehicle-brand/dtos/vehicle-brand.dto';

export class PartGetFullResponseDto extends OmitType(PartDto, [
  'partType',
  'vehicleBrand',
] as const) {
  @ApiProperty({
    required: true,
    type: PartTypeGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(PartTypeGetResponseDto) }],
  })
  @Type(() => PartTypeGetResponseDto)
  partType: PartTypeGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleBrandDto,
    oneOf: [{ $ref: getSchemaPath(VehicleBrandDto) }],
  })
  @Type(() => VehicleBrandDto)
  vehicleBrand: VehicleBrandDto;
}
