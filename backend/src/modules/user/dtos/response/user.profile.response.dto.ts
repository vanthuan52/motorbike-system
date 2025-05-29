import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserGetResponseDto } from './user.get.response.dto';
import { RoleGetResponseDto } from '@/modules/role/dtos/response/role.get.response.dto';

export class UserProfileResponseDto extends OmitType(UserGetResponseDto, [
  'role',
] as const) {
  @ApiProperty({
    required: true,
    type: RoleGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(RoleGetResponseDto) }],
  })
  @Type(() => RoleGetResponseDto)
  role: RoleGetResponseDto;
}
