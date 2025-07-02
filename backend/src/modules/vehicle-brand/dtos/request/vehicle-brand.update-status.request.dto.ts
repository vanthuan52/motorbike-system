import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ENUM_VEHICLE_BRAND_STATUS } from '../../enums/vehicle-brand.enum';

export class VehicleBrandUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_VEHICLE_BRAND_STATUS.ACTIVE,
    enum: ENUM_VEHICLE_BRAND_STATUS,
  })
  @IsEnum(ENUM_VEHICLE_BRAND_STATUS)
  status: ENUM_VEHICLE_BRAND_STATUS;
}
