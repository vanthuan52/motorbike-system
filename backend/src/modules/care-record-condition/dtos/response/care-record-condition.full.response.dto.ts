import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordGetResponseDto } from '@/modules/care-record/dtos/response/care-record.get.response.dto';
import { CareRecordConditionGetResponseDto } from './care-record-condition.get.response.dto';

export class CareRecordConditionGetFullResponseDto extends OmitType(
  CareRecordConditionGetResponseDto,
  ['careRecord'] as const,
) {
  @ApiProperty({
    required: false,
    type: CareRecordGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordGetResponseDto) }],
  })
  @Type(() => CareRecordGetResponseDto)
  careRecord: CareRecordGetResponseDto;
}
