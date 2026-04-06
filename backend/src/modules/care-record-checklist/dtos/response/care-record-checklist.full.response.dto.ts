import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ServiceChecklistDto } from '@/modules/service-checklist/dtos/service-checklist.dto';
import { CareRecordServiceDto } from '@/modules/care-record-service/dtos/care-record-service.dto';
import { PartDto } from '@/modules/part/dtos/part.dto';
import { CareRecordChecklistDto } from '../care-record-checklist.dto';

export class CareRecordChecklistGetFullResponseDto extends OmitType(
  CareRecordChecklistDto,
  ['careRecordService', 'serviceChecklist', 'parts'] as const
) {
  @ApiProperty({
    required: false,
    type: CareRecordServiceDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordServiceDto) }],
  })
  @Type(() => CareRecordServiceDto)
  careRecordService: CareRecordServiceDto;

  @ApiProperty({
    required: true,
    type: ServiceChecklistDto,
    oneOf: [{ $ref: getSchemaPath(ServiceChecklistDto) }],
  })
  @Type(() => ServiceChecklistDto)
  serviceChecklist: ServiceChecklistDto;

  @ApiProperty({
    required: true,
    type: PartDto,
    oneOf: [{ $ref: getSchemaPath(PartDto) }],
  })
  @Type(() => PartDto)
  parts: PartDto[];
}
