import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { RoleDto } from '../role.dto';

export class RoleListResponseDto extends OmitType(RoleDto, [
  'abilities',
  'description',
] as const) {
  @ApiHideProperty()
  @Exclude()
  description?: string;

  @ApiProperty({
    description: 'count of permissions',
    required: true,
  })
  @Transform(({ value }) => value.length)
  abilities: number;
}
