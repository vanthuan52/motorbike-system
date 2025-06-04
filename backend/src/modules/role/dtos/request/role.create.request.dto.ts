import { faker } from '@faker-js/faker';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleUpdateRequestDto } from './role.update.request.dto';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';

export class RoleCreateRequestDto extends IntersectionType(
  OmitType(RoleUpdateRequestDto, ['description'] as const),
  PickType(RoleUpdateRequestDto, ['description'] as const),
) {
  @ApiProperty({
    description: 'Name of role',
    example: faker.person.jobTitle(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    description: 'Representative for role type',
    example: ENUM_POLICY_ROLE_TYPE.ADMIN,
    required: true,
    enum: ENUM_POLICY_ROLE_TYPE,
  })
  @IsEnum(ENUM_POLICY_ROLE_TYPE)
  @IsNotEmpty()
  type: ENUM_POLICY_ROLE_TYPE;
}
