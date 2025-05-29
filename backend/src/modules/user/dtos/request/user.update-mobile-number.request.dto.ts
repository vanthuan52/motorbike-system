import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdateMobileNumberRequestDto {
  @ApiProperty({
    example: `628${faker.string.fromCharacters('1234567890', {
      min: 7,
      max: 11,
    })}`,
    required: true,
    maxLength: 20,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  phone: string;
}
