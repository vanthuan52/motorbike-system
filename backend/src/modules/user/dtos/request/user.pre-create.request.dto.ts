import { IsPhoneNumber } from '@/common/request/validations/request.is-phone-number.validation';
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

export class UserPreCreateRequestDto {
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
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: faker.internet.email(),
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    example: faker.string.uuid(),
    required: false,
  })
  @IsOptional()
  @IsUUID()
  role: string;
}
