import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SessionDto } from '../session.dto';
import { UserDto } from '@/modules/user/dtos/user.dto';

export class SessionGetFullResponseDto extends OmitType(SessionDto, [
  'user',
] as const) {
  @ApiProperty({
    required: true,
    type: UserDto,
    oneOf: [{ $ref: getSchemaPath(UserDto) }],
  })
  @Type(() => UserDto)
  user: UserDto;
}
