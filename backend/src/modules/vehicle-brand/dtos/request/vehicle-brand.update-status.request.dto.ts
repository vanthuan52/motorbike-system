import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnumVehicleBrandStatus } from '../../enums/vehicle-brand.enum';

export class VehicleBrandUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumVehicleBrandStatus.active,
    enum: EnumVehicleBrandStatus,
  })
  @IsEnum(EnumVehicleBrandStatus)
  status: EnumVehicleBrandStatus;
}
