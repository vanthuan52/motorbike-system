import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { RoleDto } from '@/modules/role/dtos/role.dto';

export class RoleListResponseDto extends OmitType(RoleDto, [
  'abilities',
] as const) {
  @ApiHideProperty()
  @Exclude()
  description?: string;

  @ApiProperty({
    description: 'count of abilities',
    required: true,
  })
  @Transform(({ value }) => value.length)
  abilities: number;
}
