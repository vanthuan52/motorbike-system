import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { RoleService } from '@/modules/role/services/role.service';
import { RoleRequiredMetaKey } from '@/modules/role/constants/role.constant';
import { PermissionModel } from '@/modules/permission/models/permission.model';

/**
 * Guard that validates user access based on role names.
 * After validation, attaches user's permissions (collected from all roles) to the request.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles =
      this.reflector.get<string[]>(RoleRequiredMetaKey, context.getHandler()) ??
      [];

    const request = context.switchToHttp().getRequest<IRequestApp>();
    const permissions: PermissionModel[] =
      await this.roleService.validateRoleGuard(request, requiredRoles);

    // Convert permissions to abilities format for PolicyAbilityGuard
    request.__abilities = permissions.map(p => ({
      subject: p.subject,
      action: [p.action],
    }));

    return true;
  }
}
