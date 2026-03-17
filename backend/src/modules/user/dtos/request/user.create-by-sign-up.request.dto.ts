import { IsPhoneNumber } from '@/common/request/validations/request.is-phone-number.validation';
import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserCreateRequestDto } from './user.create.request.dto';
import { IsCustomEmail } from '@/common/request/validations/request.custom-email.validation';

export class UserCreateBySignUpRequestDto extends OmitType(
  UserCreateRequestDto,
  ['role', 'email', 'password', 'status'] as const,
) {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
    maxLength: 100,
  })
  @IsCustomEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    example: faker.person.fullName(),
    required: true,
    maxLength: 100,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: faker.phone.number(),
    required: false,
    maxLength: 15,
    minLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  passwordHash: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  roleId: string;
}
