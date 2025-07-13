import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordGetResponseDto } from './care-record.get.response.dto';
import { VehicleModelGetResponseDto } from '@/modules/vehicle-model/dtos/response/vehicle-model.get.response.dto';
import { VehicleServiceGetResponseDto } from '@/modules/vehicle-service/dtos/response/vehicle-service.get.response.dto';

export class CareRecordGetFullResponseDto extends OmitType(
  CareRecordGetResponseDto,
  ['vehicleModel', 'vehicleService'] as const,
) {
  @ApiProperty({
    required: true,
    type: VehicleModelGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleModelGetResponseDto) }],
  })
  @Type(() => VehicleModelGetResponseDto)
  vehicleModel: VehicleModelGetResponseDto;

  @ApiProperty({
    required: true,
    type: VehicleServiceGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleServiceGetResponseDto) }],
  })
  @Type(() => VehicleServiceGetResponseDto)
  vehicleService: VehicleServiceGetResponseDto;
}
