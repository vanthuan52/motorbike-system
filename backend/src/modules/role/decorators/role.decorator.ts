import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RoleRequiredMetaKey } from '@/modules/role/constants/role.constant';
import { RoleGuard } from '@/modules/role/guards/role.guard';
import { EnumRoleType } from '@/modules/role/enums/role.enum';

/**
 * Method decorator that applies role-based protection guards
 * @param {...RoleRequiredMetaKey[]} requiredRoles - List of role types required for access
 * @returns {MethodDecorator} Combined decorators for role validation
 */
export function RoleProtected(
  ...requiredRoles: EnumRoleType[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(RoleGuard),
    SetMetadata(RoleRequiredMetaKey, requiredRoles)
  );
}
