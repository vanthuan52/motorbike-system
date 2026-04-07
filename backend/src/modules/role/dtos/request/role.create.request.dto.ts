import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleUpdateRequestDto } from '@/modules/role/dtos/request/role.update.request.dto';

export class RoleCreateRequestDto extends RoleUpdateRequestDto {
  @ApiProperty({
    description: 'Name of role',
    example: faker.person.jobTitle(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(30)
  @Transform(({ value }) => value.toLowerCase().trim())
  name: Lowercase<string>;
  @ApiProperty({
    description: 'Code of role',
    example: 'ADMIN',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(30)
  @Transform(({ value }) => value.toUpperCase().trim())
  code: string;
}
