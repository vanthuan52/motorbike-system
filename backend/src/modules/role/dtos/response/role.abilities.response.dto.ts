import { PickType } from '@nestjs/swagger';
import { RoleDto } from '@/modules/role/dtos/role.dto';

export class RoleAbilitiesResponseDto extends PickType(RoleDto, [
  'abilities',
]) {}
