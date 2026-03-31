import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

export class PermissionDto extends DatabaseDto {
  @ApiProperty({
    description: 'Name of permission',
    example: 'Read Users',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Unique code of permission',
    example: 'user:read',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: 'Description of permission',
    example: faker.lorem.sentence(),
    required: false,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: 'Permission group for categorization',
    example: 'user',
    required: true,
  })
  group: string;

  @ApiProperty({
    required: true,
    description: 'Permission action',
    enum: EnumPolicySubject,
  })
  subject: EnumPolicySubject;

  @ApiProperty({
    required: true,
    description: 'Permission action',
    enum: EnumPolicyAction,
  })
  action: EnumPolicyAction;

  @ApiProperty({
    required: true,
    description: 'Whether the permission is active',
    default: true,
  })
  isActive: boolean;
}
