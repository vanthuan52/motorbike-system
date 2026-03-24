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
    example: faker.person.jobTitle(),
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Description of permission',
    example: faker.lorem.sentence(),
    required: false,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    required: true,
    description: 'Ability subject',
    enum: EnumPolicySubject,
  })
  subject: EnumPolicySubject;

  @ApiProperty({
    required: true,
    description: 'Ability action base on subject',
    isArray: true,
    default: [EnumPolicyAction.manage],
    enum: EnumPolicyAction,
  })
  action: EnumPolicyAction[];
}
