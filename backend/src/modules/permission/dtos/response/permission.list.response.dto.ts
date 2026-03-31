import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';

export class PermissionListResponseDto extends OmitType(PermissionDto, [
  'description',
] as const) {
  @ApiHideProperty()
  @Exclude()
  description?: string;
}
