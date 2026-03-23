import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumVehicleServiceStatus } from '../../enums/vehicle-service.enum';

export class VehicleServiceUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumVehicleServiceStatus.active,
    enum: EnumVehicleServiceStatus,
  })
  @IsEnum(EnumVehicleServiceStatus)
  @IsNotEmpty()
  status: EnumVehicleServiceStatus;
}
