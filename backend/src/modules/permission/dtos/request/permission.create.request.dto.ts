import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

export class PermissionCreateRequestDto extends PermissionUpdateRequestDto {
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
    required: true,
    description: 'Ability subject',
    enum: EnumPolicySubject,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(EnumPolicySubject)
  subject: EnumPolicySubject;

  @ApiProperty({
    required: true,
    description: 'Ability action base on subject',
    isArray: true,
    default: [EnumPolicyAction.manage],
    enum: EnumPolicyAction,
  })
  @IsString({ each: true })
  @IsEnum(EnumPolicyAction, { each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  action: EnumPolicyAction[];
}
