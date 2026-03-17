import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { MediaEmbeddedResponseDto } from '@/modules/media/dtos/response/media.embedded.response.dto';
import {
  EnumUserGender,
  EnumUserLoginFrom,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { UserTwoFactorDto } from './user.two-factor.dto';

export class UserDto extends DatabaseDto {
  @ApiProperty({
    required: false,
    example: faker.person.fullName(),
    maxLength: 100,
    minLength: 1,
  })
  name?: string;

  @ApiProperty({
    required: true,
    example: faker.internet.email(),
    maxLength: 100,
  })
  email: Lowercase<string>;

  @ApiProperty({
    required: false,
    example: faker.phone.number(),
    maxLength: 20,
  })
  phone?: string;

  @ApiHideProperty()
  @Exclude()
  password?: string;

  @ApiProperty({
    required: false,
    example: faker.date.future(),
    description: 'Date when password expires',
  })
  passwordExpired?: Date;

  @ApiProperty({
    required: false,
    example: faker.date.past(),
    description: 'Date when password was created',
  })
  passwordCreated?: Date;

  @ApiProperty({
    required: false,
    example: 0,
    minimum: 0,
    description: 'Number of failed password attempts',
  })
  passwordAttempt?: number;

  @ApiProperty({
    required: false,
    example: true,
    default: false,
    description: 'Whether the user email is verified',
  })
  isVerified?: boolean;

  @ApiProperty({
    required: false,
    example: faker.date.past(),
    description: 'Date when user was verified',
  })
  verifiedAt?: Date;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
    type: 'string',
    description: 'User role ID or populated role object',
  })
  role: string;

  @ApiProperty({
    required: true,
    example: EnumUserStatus.active,
    enum: EnumUserStatus,
    description: 'User account status',
  })
  status: EnumUserStatus;

  @ApiProperty({
    example: EnumUserGender.male,
    enum: EnumUserGender,
    required: false,
    description: 'User gender',
  })
  gender?: EnumUserGender;

  @ApiProperty({
    required: false,
    type: () => MediaEmbeddedResponseDto,
    description: 'User profile photo',
  })
  @Type(() => MediaEmbeddedResponseDto)
  photo?: MediaEmbeddedResponseDto;

  // Sign up tracking
  @ApiProperty({
    required: false,
    example: faker.date.recent(),
    description: 'Date when user signed up',
  })
  signUpDate?: Date;

  @ApiProperty({
    required: false,
    example: EnumUserSignUpFrom.admin,
    enum: EnumUserSignUpFrom,
    description: 'Platform from which user signed up',
  })
  signUpFrom?: EnumUserSignUpFrom;

  @ApiProperty({
    required: false,
    example: EnumUserSignUpWith.credential,
    enum: EnumUserSignUpWith,
    description: 'Method used for sign up',
  })
  signUpWith?: EnumUserSignUpWith;

  // Last login tracking
  @ApiProperty({
    required: false,
    description: 'Last login time of user',
    example: faker.date.recent(),
  })
  lastLoginAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Last IP Address of user',
    example: faker.internet.ipv4(),
    maxLength: 50,
  })
  lastIPAddress?: string;

  @ApiProperty({
    required: false,
    enum: EnumUserLoginFrom,
    example: EnumUserLoginFrom.website,
    description: 'Platform from which user last logged in',
  })
  lastLoginFrom?: EnumUserLoginFrom;

  @ApiProperty({
    required: false,
    enum: EnumUserSignUpWith,
    example: EnumUserSignUpWith.credential,
    description: 'Method used for last login',
  })
  lastLoginWith?: EnumUserSignUpWith;

  @ApiProperty({
    required: false,
    type: UserTwoFactorDto,
  })
  @Type(() => UserTwoFactorDto)
  twoFactor?: UserTwoFactorDto;
}
