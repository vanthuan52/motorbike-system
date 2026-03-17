import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';

export class SessionDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    type: String,
    example: faker.string.uuid(),
  })
  user: string;

  @ApiProperty({
    required: true,
    example: faker.internet.ipv4(),
  })
  ip: string;

  @ApiProperty({
    required: true,
    type: RequestUserAgentDto,
  })
  @Type(() => RequestUserAgentDto)
  userAgent: RequestUserAgentDto;

  @ApiProperty({
    required: true,
    example: faker.date.future(),
  })
  expiredAt: Date;

  @ApiProperty({
    required: false,
    example: faker.date.future(),
  })
  revokedAt?: Date;

  @ApiProperty({
    required: true,
    example: false,
  })
  isRevoked: boolean;
}
