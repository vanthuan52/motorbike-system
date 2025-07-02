import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartGetResponseDto } from './part.get.response.dto';
import { PartTypeGetResponseDto } from '@/modules/part-type/dtos/response/part-type.get.response.dto';

export class PartGetFullResponseDto extends OmitType(PartGetResponseDto, [
  'type',
] as const) {
  @ApiProperty({
    required: true,
    type: PartTypeGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(PartTypeGetResponseDto) }],
  })
  @Type(() => PartTypeGetResponseDto)
  type: PartTypeGetResponseDto;
}
