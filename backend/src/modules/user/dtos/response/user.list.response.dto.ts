import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserDto } from '@/modules/user/dtos/user.dto';
import {
  EnumUserGender,
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
} from '@/modules/user/enums/user.enum';

export class UserListResponseDto extends UserDto {
  @ApiHideProperty()
  @Exclude()
  passwordAttempt?: number;

  @ApiHideProperty()
  @Exclude()
  signUpDate: Date;

  @ApiHideProperty()
  @Exclude()
  signUpFrom: EnumUserSignUpFrom;

  @ApiHideProperty()
  @Exclude()
  signUpWith: EnumUserSignUpWith;

  @ApiHideProperty()
  @Exclude()
  gender?: EnumUserGender;

  @ApiHideProperty()
  @Exclude()
  lastLoginAt?: Date;

  @ApiHideProperty()
  @Exclude()
  lastIPAddress?: string;

  @ApiHideProperty()
  @Exclude()
  lastLoginFrom?: EnumUserLoginFrom;

  @ApiHideProperty()
  @Exclude()
  lastLoginWith?: EnumUserLoginWith;
}
