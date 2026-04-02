import { RoleModel } from '../models/role.model';
import { PermissionMapper } from '@/modules/permission/mappers/permission.mapper';

export class RoleMapper {
  static toDomain(prismaRole: any): RoleModel {
    const model = new RoleModel();
    model.id = prismaRole.id;
    model.name = prismaRole.name;
    model.description = prismaRole.description;
    model.isActive = prismaRole.isActive;
    model.type = prismaRole.type;

    model.createdAt = prismaRole.createdAt;
    model.updatedAt = prismaRole.updatedAt;
    model.deletedAt = prismaRole.deletedAt;
    model.createdBy = prismaRole.createdBy;
    model.updatedBy = prismaRole.updatedBy;
    model.deletedBy = prismaRole.deletedBy;

    // Map permissions via rolePermissions junction table
    if (
      prismaRole.rolePermissions &&
      Array.isArray(prismaRole.rolePermissions)
    ) {
      model.permissions = prismaRole.rolePermissions
        .filter((rp: any) => rp.permission)
        .map((rp: any) => PermissionMapper.toDomain(rp.permission));
    }

    return model;
  }
}
