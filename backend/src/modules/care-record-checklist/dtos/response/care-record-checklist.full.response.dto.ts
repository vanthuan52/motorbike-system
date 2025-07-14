import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordChecklistGetResponseDto } from './care-record-checklist.get.response.dto';
import { ServiceChecklistGetResponseDto } from '@/modules/service-checklist/dtos/response/service-checklist.get.response.dto';
import { CareRecordGetResponseDto } from '@/modules/care-record/dtos/response/care-record.get.response.dto';

export class CareRecordChecklistGetFullResponseDto extends OmitType(
  CareRecordChecklistGetResponseDto,
  ['careRecord', 'serviceChecklist'] as const,
) {
  @ApiProperty({
    required: false,
    type: CareRecordGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordGetResponseDto) }],
  })
  @Type(() => CareRecordGetResponseDto)
  careRecord: CareRecordGetResponseDto;

  @ApiProperty({
    required: true,
    type: ServiceChecklistGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceChecklistGetResponseDto) }],
  })
  @Type(() => ServiceChecklistGetResponseDto)
  serviceChecklist: ServiceChecklistGetResponseDto;
}
