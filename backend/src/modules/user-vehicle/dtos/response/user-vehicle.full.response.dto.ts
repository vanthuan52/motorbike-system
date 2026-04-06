import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserVehicleDto } from '../user-vehicle.dto';
import { VehicleModelDto } from '@/modules/vehicle-model/dtos/vehicle-model.dto';

export class UserVehicleGetFullResponseDto extends OmitType(UserVehicleDto, [
  'vehicleModel',
] as const) {
  @ApiProperty({
    required: true,
    type: VehicleModelDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelDto) }],
  })
  @Type(() => VehicleModelDto)
  vehicleModel: VehicleModelDto;
}
