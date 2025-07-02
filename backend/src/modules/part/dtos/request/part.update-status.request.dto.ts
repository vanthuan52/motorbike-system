import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_PART_STATUS } from '../../enums/part.enum';

export class PartUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_PART_STATUS.ACTIVE,
    enum: ENUM_PART_STATUS,
  })
  @IsEnum(ENUM_PART_STATUS)
  @IsNotEmpty()
  status: ENUM_PART_STATUS;
}
