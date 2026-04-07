import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumVehicleModelStatus } from '../../enums/vehicle-model.enum';

export class VehicleModelUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumVehicleModelStatus.active,
    enum: EnumVehicleModelStatus,
  })
  @IsEnum(EnumVehicleModelStatus)
  @IsNotEmpty()
  status: EnumVehicleModelStatus;
}
