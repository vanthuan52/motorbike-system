import { IsEnum, IsString } from 'class-validator';
import { EnumMessageType } from '../../enums/message.enum';
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
    example: EnumMessageType.text,
    description: 'Message type',
    required: true,
    enum: EnumMessageType,
  })
  @IsEnum(EnumMessageType)
  messageType: EnumMessageType;
}
