import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class UserMobileNumberResponseDto extends DatabaseDto {
  @ApiProperty({
    example: `8${faker.string.fromCharacters('1234567890', {
      min: 7,
      max: 11,
    })}`,
    required: true,
    maxLength: 20,
    minLength: 8,
  })
  number: string;

  @ApiProperty({
    example: faker.location.countryCode('alpha-2'),
    required: true,
    maxLength: 6,
    minLength: 1,
  })
  phoneCode: string;

  @ApiProperty({
    required: true,
    type: CountryResponseDto,
  })
  @Type(() => CountryResponseDto)
  country: CountryResponseDto;
}
