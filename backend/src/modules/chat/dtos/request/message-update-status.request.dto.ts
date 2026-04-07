import { ApiProperty } from '@nestjs/swagger';
import { EnumMessageStatus } from '../../enums/message.enum';
import { IsEnum } from 'class-validator';

export class MessageUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumMessageStatus.read,
    enum: EnumMessageStatus,
  })
  @IsEnum(EnumMessageStatus)
  status: EnumMessageStatus;
}
