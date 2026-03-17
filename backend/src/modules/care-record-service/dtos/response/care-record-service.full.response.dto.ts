import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordServiceDto } from '../care-record-service.dto';
import { CareRecordDto } from '@/modules/care-record/dtos/care-record.dto';
import { VehicleServiceDto } from '@/modules/vehicle-service/dtos/vehicle-service.dto';

export class CareRecordServiceGetFullResponseDto extends OmitType(
  CareRecordServiceDto,
  ['careRecord', 'vehicleService'] as const,
) {
  // @ApiProperty({
  //   required: false,
  //   type: CareRecordDto,
  //   oneOf: [{ $ref: getSchemaPath(CareRecordDto) }],
  // })
  // @Type(() => CareRecordDto)
  // careRecord: CareRecordDto;

  @ApiProperty({
    required: false,
    type: VehicleServiceDto,
    oneOf: [{ $ref: getSchemaPath(VehicleServiceDto) }],
  })
  @Type(() => VehicleServiceDto)
  vehicleService: VehicleServiceDto;
}
