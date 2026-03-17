import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class ConversationGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    example: [faker.string.uuid(), faker.string.uuid()],
  })
  participants: string[];

  @ApiProperty({
    required: false,
    example: faker.string.uuid(),
  })
  lastMessageId?: string;
}
