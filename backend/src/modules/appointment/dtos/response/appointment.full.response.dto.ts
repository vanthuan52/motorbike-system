import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AppointmentDto } from '../appointment.dto';
import { VehicleModelDto } from '@/modules/vehicle-model/dtos/vehicle-model.dto';
import { UserVehicleDto } from '@/modules/user-vehicle/dtos/user-vehicle.dto';
import { VehicleServiceDto } from '@/modules/vehicle-service/dtos/vehicle-service.dto';

export class AppointmentGetFullResponseDto extends OmitType(AppointmentDto, [
  'userVehicle',
  'vehicleModel',
  'vehicleServices',
] as const) {
  @ApiProperty({
    required: true,
    type: UserVehicleDto,
    oneOf: [{ $ref: getSchemaPath(UserVehicleDto) }],
  })
  @Type(() => UserVehicleDto)
  userVehicle: UserVehicleDto;

  @ApiProperty({
    required: true,
    type: VehicleServiceDto,
    oneOf: [{ $ref: getSchemaPath(VehicleServiceDto) }],
  })
  @Type(() => VehicleServiceDto)
  vehicleServices: VehicleServiceDto;

  @ApiProperty({
    required: true,
    type: VehicleModelDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelDto) }],
  })
  @Type(() => VehicleModelDto)
  vehicleModel: VehicleModelDto[];
}
