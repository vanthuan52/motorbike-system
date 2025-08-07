import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationCreateRequestDto {
  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  @IsString()
  @IsNotEmpty()
  participantId: string;
}
