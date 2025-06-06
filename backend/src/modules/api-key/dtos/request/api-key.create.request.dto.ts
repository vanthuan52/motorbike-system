import { faker } from '@faker-js/faker';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { ApiKeyUpdateRequestDto } from './api-key.update.request.dto';
import { ApiKeyUpdateDateRequestDto } from './api-key.update-date.request.dto';
import { ENUM_API_KEY_TYPE } from '../../enums/api-key.enum';

export class ApiKeyCreateRequestDto extends IntersectionType(
  ApiKeyUpdateRequestDto,
  PartialType(ApiKeyUpdateDateRequestDto),
) {
  @ApiProperty({
    description: 'Api key name',
    example: ENUM_API_KEY_TYPE.DEFAULT,
    required: true,
    enum: ENUM_API_KEY_TYPE,
  })
  @IsNotEmpty()
  @IsEnum(ENUM_API_KEY_TYPE)
  type: ENUM_API_KEY_TYPE;
}

export class ApiKeyCreateRawRequestDto extends ApiKeyCreateRequestDto {
  @ApiProperty({
    name: 'key',
    example: faker.string.alphanumeric(10),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  key: string;

  @ApiProperty({
    name: 'secret',
    example: faker.string.alpha(20),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  secret: string;
}
