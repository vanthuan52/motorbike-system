import { IsString } from 'class-validator';

export class ReadMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  messageId: string;

  @IsString()
  userId: string;
}
