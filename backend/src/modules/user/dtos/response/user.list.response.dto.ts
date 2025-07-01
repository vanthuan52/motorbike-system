import {
  ApiHideProperty,
  ApiProperty,
  getSchemaPath,
  OmitType,
} from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserGetResponseDto } from './user.get.response.dto';
import { UserUpdateMobileNumberRequestDto } from '../request/user.update-mobile-number.request.dto';
import { ENUM_USER_GENDER } from '../../enums/user.enum';
import { UserProfileResponseDto } from './user.profile.response.dto';

export class UserListResponseDto extends OmitType(UserGetResponseDto, [
  'phone',
  'gender',
  'role',
] as const) {
  @ApiProperty({
    required: true,
    type: UserProfileResponseDto,
    oneOf: [{ $ref: getSchemaPath(UserProfileResponseDto) }],
  })
  @Type(() => UserProfileResponseDto)
  role: UserProfileResponseDto;

  @ApiHideProperty()
  @Exclude()
  phone?: UserUpdateMobileNumberRequestDto;

  @ApiHideProperty()
  @Exclude()
  gender?: ENUM_USER_GENDER;
}
