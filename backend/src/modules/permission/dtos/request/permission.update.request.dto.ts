import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumRoleType } from '@/generated/prisma-client';

export class PermissionUpdateRequestDto {
  @ApiProperty({
    description: 'Description of role',
    example: faker.lorem.sentence(),
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Representative for role type',
    example: EnumRoleType.admin,
    required: true,
    enum: EnumRoleType,
  })
  @IsEnum(EnumRoleType)
  @IsNotEmpty()
  type: EnumRoleType;
}
