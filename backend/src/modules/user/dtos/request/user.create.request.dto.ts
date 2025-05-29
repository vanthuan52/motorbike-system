import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserCreateRequestDto {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
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
  phone?: string;
}
