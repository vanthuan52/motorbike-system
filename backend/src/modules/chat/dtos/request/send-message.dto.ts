import { IsEnum, IsString } from 'class-validator';
import { ENUM_MESSAGE_TYPE } from '../../enums/message.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    example: 'conversation-123',
    description: 'Conversation ID',
    required: true,
  })
  @IsString()
  conversation: string;

  @ApiProperty({
    example: 'user-123',
    description: 'Sender ID',
    required: true,
  })
  @IsString()
  sender: string;

  @ApiProperty({
    example: 'user-123',
    description: 'Receiver ID',
    required: true,
  })
  @IsString()
  receiver: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Message content',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: ENUM_MESSAGE_TYPE.TEXT,
    description: 'Message type',
    required: true,
    enum: ENUM_MESSAGE_TYPE,
  })
  @IsEnum(ENUM_MESSAGE_TYPE)
  messageType: ENUM_MESSAGE_TYPE;
}
