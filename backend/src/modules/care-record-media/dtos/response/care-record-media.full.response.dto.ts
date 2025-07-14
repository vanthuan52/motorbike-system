import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordMediaGetResponseDto } from './care-record-media.get.response.dto';
import { CareRecordGetResponseDto } from '@/modules/care-record/dtos/response/care-record.get.response.dto';

export class CareRecordMediaGetFullResponseDto extends OmitType(
  CareRecordMediaGetResponseDto,
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
