import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartGetResponseDto } from './part.get.response.dto';
import { PartTypeGetResponseDto } from '@/modules/part-type/dtos/response/part-type.get.response.dto';
import { VehicleBrandGetResponseDto } from '@/modules/vehicle-brand/dtos/response/vehicle-brand.get.response.dto';

export class PartGetFullResponseDto extends OmitType(PartGetResponseDto, [
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
    type: VehicleBrandGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleBrandGetResponseDto) }],
  })
  @Type(() => VehicleBrandGetResponseDto)
  vehicleBrand: VehicleBrandGetResponseDto;
}
