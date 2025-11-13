import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordChecklistGetResponseDto } from './care-record-checklist.get.response.dto';
import { ServiceChecklistGetResponseDto } from '@/modules/service-checklist/dtos/response/service-checklist.get.response.dto';
import { CareRecordServiceGetResponseDto } from '@/modules/care-record-service/dtos/response/care-record-service.get.response.dto';
import { PartGetResponseDto } from '@/modules/part/dtos/response/part.get.response.dto';

export class CareRecordChecklistGetFullResponseDto extends OmitType(
  CareRecordChecklistGetResponseDto,
  ['careRecordService', 'serviceChecklist', 'parts'] as const,
) {
  @ApiProperty({
    required: false,
    type: CareRecordServiceGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordServiceGetResponseDto) }],
  })
  @Type(() => CareRecordServiceGetResponseDto)
  careRecordService: CareRecordServiceGetResponseDto;

  @ApiProperty({
    required: true,
    type: ServiceChecklistGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceChecklistGetResponseDto) }],
  })
  @Type(() => ServiceChecklistGetResponseDto)
  serviceChecklist: ServiceChecklistGetResponseDto;

  @ApiProperty({
    required: true,
    type: PartGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(PartGetResponseDto) }],
  })
  @Type(() => PartGetResponseDto)
  parts: PartGetResponseDto[];
}
