import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Expose, Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { EnumActivityLogAction } from '../enums/activity-log.enum';

export class ActivityLogDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  @Expose()
  user: string;

  @ApiProperty({
    required: true,
    example: EnumActivityLogAction.userLoginCredential,
    enum: EnumActivityLogAction,
  })
  @Expose()
  action: EnumActivityLogAction;

  @ApiProperty({
    required: true,
    example: faker.internet.ipv4(),
  })
  @Expose()
  ipAddress: string;

  @ApiPropertyOptional({
    type: RequestUserAgentDto,
  })
  @Type(() => RequestUserAgentDto)
  @Expose()
  userAgent?: RequestUserAgentDto;

  @ApiPropertyOptional({
    example: { exampleKey: 'exampleValue' },
  })
  @Expose()
  metadata?: unknown;
}
