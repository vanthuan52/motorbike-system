import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { UserDto } from '../user.dto';

export class UserProfileResponseDto extends OmitType(UserDto, [
  'role',
] as const) {
  @ApiProperty({
    required: true,
    type: RoleDto,
    oneOf: [{ $ref: getSchemaPath(RoleDto) }],
  })
  @Type(() => RoleDto)
  role: RoleDto;
}
