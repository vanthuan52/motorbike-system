import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordItemGetResponseDto } from './care-record-item.get.response.dto';
import { CareRecordGetResponseDto } from '@/modules/care-record/dtos/response/care-record.get.response.dto';
import { PartGetResponseDto } from '@/modules/part/dtos/response/part.get.response.dto';

export class CareRecordItemGetFullResponseDto extends OmitType(
  CareRecordItemGetResponseDto,
  ['careRecord', 'part'] as const,
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
    type: PartGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(PartGetResponseDto) }],
  })
  @Type(() => PartGetResponseDto)
  part: PartGetResponseDto;
}
