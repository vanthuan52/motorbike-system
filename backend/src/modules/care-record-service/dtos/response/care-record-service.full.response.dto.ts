import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordServiceGetResponseDto } from './care-record-service.get.response.dto';
import { CareRecordGetResponseDto } from '@/modules/care-record/dtos/response/care-record.get.response.dto';
import { VehicleServiceGetResponseDto } from '@/modules/vehicle-service/dtos/response/vehicle-service.get.response.dto';

export class CareRecordServiceGetFullResponseDto extends OmitType(
  CareRecordServiceGetResponseDto,
  ['careRecord', 'vehicleService'] as const,
) {
  // @ApiProperty({
  //   required: false,
  //   type: CareRecordGetResponseDto,
  //   oneOf: [{ $ref: getSchemaPath(CareRecordGetResponseDto) }],
  // })
  // @Type(() => CareRecordGetResponseDto)
  // careRecord: CareRecordGetResponseDto;

  @ApiProperty({
    required: false,
    type: VehicleServiceGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(VehicleServiceGetResponseDto) }],
  })
  @Type(() => VehicleServiceGetResponseDto)
  vehicleService: VehicleServiceGetResponseDto;
}
