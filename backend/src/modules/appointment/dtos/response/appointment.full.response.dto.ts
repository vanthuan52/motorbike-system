import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AppointmentsGetResponseDto } from './appointment.get.response.dto';
import { ServiceCategoryGetResponseDto } from '@/modules/service-category/dtos/response/service-category.get.response.dto';
import { VehicleModelGetResponseDto } from '@/modules/vehicle-model/dtos/response/vehicle-model.get.response.dto';
import { UserVehicleGetResponseDto } from '@/modules/user-vehicle/dtos/response/user-vehicle.get.response.dto';

export class AppointmentsGetFullResponseDto extends OmitType(
  AppointmentsGetResponseDto,
  ['userVehicle', 'vehicleModel', 'vehicleServices'] as const,
) {
  @ApiProperty({
    required: true,
    type: ServiceCategoryGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceCategoryGetResponseDto) }],
  })
  @Type(() => ServiceCategoryGetResponseDto)
  vehicleServices: ServiceCategoryGetResponseDto;

  @ApiProperty({
    required: true,
    type: UserVehicleGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(UserVehicleGetResponseDto) }],
  })
  @Type(() => UserVehicleGetResponseDto)
  userVehicle: UserVehicleGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleModelGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelGetResponseDto) }],
  })
  @Type(() => VehicleModelGetResponseDto)
  vehicleModel: VehicleModelGetResponseDto;
}
