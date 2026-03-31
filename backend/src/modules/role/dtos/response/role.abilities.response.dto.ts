import { PickType } from '@nestjs/swagger';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionsResponseDto {
  @ApiProperty({
    type: [PermissionDto],
    required: true,
    isArray: true,
    default: [],
  })
  permissions: PermissionDto[];
}
