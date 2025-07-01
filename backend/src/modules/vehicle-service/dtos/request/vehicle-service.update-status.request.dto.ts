import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../../enums/vehicle-service.enum';

export class VehicleServiceUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    enum: ENUM_VEHICLE_SERVICE_STATUS,
  })
  @IsEnum(ENUM_VEHICLE_SERVICE_STATUS)
  @IsNotEmpty()
  status: ENUM_VEHICLE_SERVICE_STATUS;
}
