import {
  ApiHideProperty,
  ApiProperty,
  getSchemaPath,
  OmitType,
} from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserGetResponseDto } from './user.get.response.dto';
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { UserUpdateMobileNumberRequestDto } from '../request/user.update-mobile-number.request.dto';
import { ENUM_USER_GENDER } from '../../enums/user.enum';

export class UserListResponseDto extends OmitType(UserGetResponseDto, [
  'phone',
  'gender',
  'role',
] as const) {
  @ApiProperty({
    required: true,
    type: RoleListResponseDto,
    oneOf: [{ $ref: getSchemaPath(RoleListResponseDto) }],
  })
  @Type(() => RoleListResponseDto)
  role: RoleListResponseDto;

  @ApiHideProperty()
  @Exclude()
  phone?: UserUpdateMobileNumberRequestDto;

  @ApiHideProperty()
  @Exclude()
  gender?: ENUM_USER_GENDER;
}
