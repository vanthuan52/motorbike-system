import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AppointmentGetResponseDto } from './appointment.get.response.dto';
import { VehicleModelGetResponseDto } from '@/modules/vehicle-model/dtos/response/vehicle-model.get.response.dto';
import { UserVehicleGetResponseDto } from '@/modules/user-vehicle/dtos/response/user-vehicle.get.response.dto';
import { VehicleServiceGetResponseDto } from '@/modules/vehicle-service/dtos/response/vehicle-service.get.response.dto';

export class AppointmentGetFullResponseDto extends OmitType(
  AppointmentGetResponseDto,
  ['userVehicle', 'vehicleModel', 'vehicleServices'] as const,
) {
  @ApiProperty({
    required: true,
    type: UserVehicleGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(UserVehicleGetResponseDto) }],
  })
  @Type(() => UserVehicleGetResponseDto)
  userVehicle: UserVehicleGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleServiceGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleServiceGetResponseDto) }],
  })
  @Type(() => VehicleServiceGetResponseDto)
  vehicleServices: VehicleServiceGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleModelGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelGetResponseDto) }],
  })
  @Type(() => VehicleModelGetResponseDto)
  vehicleModel: VehicleModelGetResponseDto;
}
