import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserVehicleGetResponseDto } from './user-vehicle.get.response.dto';
import { VehicleModelGetResponseDto } from '@/modules/vehicle-model/dtos/response/vehicle-model.get.response.dto';

export class UserVehicleGetFullResponseDto extends OmitType(
  UserVehicleGetResponseDto,
  ['vehicleModel'] as const,
) {
  @ApiProperty({
    required: true,
    type: VehicleModelGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelGetResponseDto) }],
  })
  @Type(() => VehicleModelGetResponseDto)
  vehicleModel: VehicleModelGetResponseDto;
}
