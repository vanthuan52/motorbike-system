import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class RoleDto extends DatabaseDto {
  @ApiProperty({
    description: 'Name of role',
    example: faker.person.jobTitle(),
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Description of role',
    example: faker.lorem.sentence(),
    required: false,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: 'Representative for role type',
    example: 'admin',
    required: true,
  })
  type: string;

  @ApiProperty({
    description: 'Whether the role is active',
    required: true,
    default: true,
  })
  isActive: boolean;
}
