import { IsString } from 'class-validator';

export class JoinConversationDto {
  @IsString()
  conversationId: string;

  @IsString()
  userId: string;
}
