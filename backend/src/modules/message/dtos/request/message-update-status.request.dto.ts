import { ApiProperty } from '@nestjs/swagger';
import { ENUM_MESSAGE_STATUS } from '../../enums/message.enum';
import { IsEnum } from 'class-validator';

export class MessageUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_MESSAGE_STATUS.READ,
    enum: ENUM_MESSAGE_STATUS,
  })
  @IsEnum(ENUM_MESSAGE_STATUS)
  status: ENUM_MESSAGE_STATUS;
}
