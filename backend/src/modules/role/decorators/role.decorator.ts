import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RoleRequiredMetaKey } from '@/modules/role/constants/role.constant';
import { RoleGuard } from '@/modules/role/guards/role.guard';

/**
 * Method decorator that applies role-based protection guards
 * @param {...string[]} requiredRoles - List of role names required for access
 * @returns {MethodDecorator} Combined decorators for role validation
 */
export function RoleProtected(...requiredRoles: string[]): MethodDecorator {
  return applyDecorators(
    UseGuards(RoleGuard),
    SetMetadata(RoleRequiredMetaKey, requiredRoles)
  );
}
