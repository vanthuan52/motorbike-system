import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { RoleListResponseDto } from './role.list.response.dto';
import { Exclude } from 'class-transformer';

export class RoleShortResponseDto extends OmitType(RoleListResponseDto, [
  'permissions',
  'isActive',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiHideProperty()
  @Exclude()
  permissions: number;

  @ApiHideProperty()
  @Exclude()
  isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
