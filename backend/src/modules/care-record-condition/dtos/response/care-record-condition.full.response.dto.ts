import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordDto } from '@/modules/care-record/dtos/care-record.dto';
import { CareRecordConditionDto } from '../care-record-condition.dto';

export class CareRecordConditionGetFullResponseDto extends OmitType(
  CareRecordConditionDto,
  ['careRecord'] as const
) {
  @ApiProperty({
    required: false,
    type: CareRecordDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordDto) }],
  })
  @Type(() => CareRecordDto)
  careRecord: CareRecordDto;
}
