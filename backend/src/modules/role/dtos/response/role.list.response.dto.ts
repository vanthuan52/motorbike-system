import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RoleDto } from '@/modules/role/dtos/role.dto';

export class RoleListResponseDto extends RoleDto {
  @ApiHideProperty()
  @Exclude()
  description?: string;
}
