import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { PermissionRequiredMetaKey } from '@/modules/permission/constants/permission.constant';

/**
 * Guard placeholder for permission-specific checks.
 * The main RBAC flow goes through RoleGuard → PolicyAbilityGuard.
 * This guard can be used for additional permission-level validations if needed.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<string[]>(
        PermissionRequiredMetaKey,
        context.getHandler()
      ) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequestApp>();
    // Permission validation is handled through the PolicyAbilityGuard flow
    // This guard exists as an extension point for future permission-specific logic
    return true;
  }
}
