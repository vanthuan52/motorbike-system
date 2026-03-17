import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  EnumUserGender,
  EnumUserLoginFrom,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
} from '../../enums/user.enum';
import { UserDto } from '../user.dto';

export class UserListResponseDto extends OmitType(UserDto, [
  'passwordExpired',
  'passwordCreated',
  'passwordAttempt',
  'signUpDate',
  'signUpFrom',
  'signUpWith',
  'gender',
  'lastLoginAt',
  'lastIPAddress',
  'lastLoginFrom',
  'lastLoginWith',
] as const) {
  @ApiHideProperty()
  @Exclude()
  passwordExpired?: Date;

  @ApiHideProperty()
  @Exclude()
  passwordCreated?: Date;

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
  lastLoginWith?: EnumUserSignUpWith;
}
