import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsPhoneNumber } from '@/common/request/validations/request.is-phone-number.validation';
import { IsCustomEmail } from '@/common/request/validations/request.custom-email.validation';
import { UserDto } from '../user.dto';

export class UserCreateRequestDto extends OmitType(UserDto, [
  '_id',
  'role',
  'email',
  'name',
  'phone',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
    maxLength: 100,
  })
  @IsCustomEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  role: string;

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
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
