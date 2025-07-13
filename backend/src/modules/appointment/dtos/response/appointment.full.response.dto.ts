import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AppointmentsGetResponseDto } from './appointment.get.response.dto';
import { ServiceCategoryGetResponseDto } from '@/modules/service-category/dtos/response/service-category.get.response.dto';
import { VehicleBrandGetResponseDto } from '@/modules/vehicle-brand/dtos/response/vehicle-brand.get.response.dto';
import { VehicleModelGetResponseDto } from '@/modules/vehicle-model/dtos/response/vehicle-model.get.response.dto';

export class AppointmentsGetFullResponseDto extends OmitType(
  AppointmentsGetResponseDto,
  ['vehicleBrand', 'vehicleModel', 'serviceCategory'] as const,
) {
  @ApiProperty({
    required: true,
    type: ServiceCategoryGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceCategoryGetResponseDto) }],
  })
  @Type(() => ServiceCategoryGetResponseDto)
  serviceCategory: ServiceCategoryGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleBrandGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleBrandGetResponseDto) }],
  })
  @Type(() => VehicleBrandGetResponseDto)
  vehicleBrand: VehicleBrandGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleModelGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelGetResponseDto) }],
  })
  @Type(() => VehicleModelGetResponseDto)
  vehicleModel: VehicleModelGetResponseDto;
}
