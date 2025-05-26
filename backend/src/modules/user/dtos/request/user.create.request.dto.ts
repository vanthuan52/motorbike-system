import { faker } from '@faker-js/faker/.';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UserCreateRequestDto {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  email: string;
}
