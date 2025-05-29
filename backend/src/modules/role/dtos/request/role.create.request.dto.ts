import { faker } from '@faker-js/faker';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { RoleUpdateRequestDto } from './role.update.request.dto';

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
}
