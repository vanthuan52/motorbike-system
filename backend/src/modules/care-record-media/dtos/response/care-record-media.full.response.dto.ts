import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordMediaDto } from '../care-record-media.dto';
import { CareRecordDto } from '@/modules/care-record/dtos/care-record.dto';

export class CareRecordMediaGetFullResponseDto extends OmitType(
  CareRecordMediaDto,
  ['careRecord'] as const,
) {
  @ApiProperty({
    required: false,
    type: CareRecordDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordDto) }],
  })
  @Type(() => CareRecordDto)
  careRecord: CareRecordDto;
}
