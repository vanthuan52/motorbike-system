import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ENUM_PART_TYPE_STATUS } from '../../enums/part-type.enum';

export class PartTypeUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_PART_TYPE_STATUS.ACTIVE,
    enum: ENUM_PART_TYPE_STATUS,
  })
  @IsEnum(ENUM_PART_TYPE_STATUS)
  status: ENUM_PART_TYPE_STATUS;
}
