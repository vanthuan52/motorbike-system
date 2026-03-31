import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

export class PermissionCreateRequestDto {
  @ApiProperty({
    description: 'Name of permission',
    example: 'Read Users',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Unique code of permission (e.g. user:read)',
    example: 'user:read',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Description of permission',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Permission group for categorization',
    example: 'user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  group: string;

  @ApiProperty({
    required: true,
    description: 'Permission action',
    enum: EnumPolicyAction,
  })
  @IsNotEmpty()
  @IsEnum(EnumPolicyAction)
  action: EnumPolicyAction;

  @ApiProperty({
    required: true,
    description: 'Permission subject',
    enum: EnumPolicySubject,
  })
  @IsNotEmpty()
  @IsEnum(EnumPolicySubject)
  subject: EnumPolicySubject;
}
