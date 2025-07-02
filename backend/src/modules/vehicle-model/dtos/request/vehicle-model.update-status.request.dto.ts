import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_VEHICLE_MODEL_STATUS } from '../../enums/vehicle-model.enum';

export class VehicleModelUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_VEHICLE_MODEL_STATUS.ACTIVE,
    enum: ENUM_VEHICLE_MODEL_STATUS,
  })
  @IsEnum(ENUM_VEHICLE_MODEL_STATUS)
  @IsNotEmpty()
  status: ENUM_VEHICLE_MODEL_STATUS;
}
