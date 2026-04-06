import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordItemDto } from '../care-record-item.dto';
import { CareRecordDto } from '@/modules/care-record/dtos/care-record.dto';
import { PartDto } from '@/modules/part/dtos/part.dto';

export class CareRecordItemGetFullResponseDto extends OmitType(
  CareRecordItemDto,
  ['careRecord', 'part'] as const
) {
  @ApiProperty({
    required: false,
    type: CareRecordDto,
    oneOf: [{ $ref: getSchemaPath(CareRecordDto) }],
  })
  @Type(() => CareRecordDto)
  careRecord: CareRecordDto;

  @ApiProperty({
    required: true,
    type: PartDto,
    oneOf: [{ $ref: getSchemaPath(PartDto) }],
  })
  @Type(() => PartDto)
  part: PartDto;
}
