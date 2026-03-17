import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ActivityLogDto } from '../activity-log.dto';
import { UserDto } from '@/modules/user/dtos/user.dto';

export class ActivityLogGetFullResponseDto extends OmitType(ActivityLogDto, [
  'user',
] as const) {
  @ApiProperty({
    required: false,
    type: UserDto,
    oneOf: [{ $ref: getSchemaPath(UserDto) }],
  })
  @Type(() => UserDto)
  user: UserDto;
}
