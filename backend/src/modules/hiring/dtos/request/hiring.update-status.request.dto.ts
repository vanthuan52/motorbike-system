import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ENUM_HIRING_STATUS } from '../../enums/hiring.enum';

export class HiringUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_HIRING_STATUS.PUBLISHED,
    enum: ENUM_HIRING_STATUS,
  })
  @IsEnum(ENUM_HIRING_STATUS)
  status: ENUM_HIRING_STATUS;
}
