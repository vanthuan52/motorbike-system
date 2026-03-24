import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';

export class PermissionListResponseDto extends OmitType(PermissionDto, [
  'action',
] as const) {
  @ApiHideProperty()
  @Exclude()
  description?: string;
}
