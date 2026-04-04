import { RoleModel } from '../models/role.model';
import { PermissionMapper } from '@/modules/permission/mappers/permission.mapper';
import { Role as PrismaRole, Prisma } from '@/generated/prisma-client';

export type PrismaRoleWithRelations = Prisma.RoleGetPayload<{
  include: {
    rolePermissions: {
      include: { permission: true };
    };
  };
}>;

export class RoleMapper {
  static toDomain(prismaRole: PrismaRole | PrismaRoleWithRelations): RoleModel {
    const model = new RoleModel();
    model.id = prismaRole.id;
    model.name = prismaRole.name;
    model.code = prismaRole.code;
    model.description = prismaRole.description;
    model.isActive = prismaRole.isActive;
    model.type = prismaRole.type;

    model.createdAt = prismaRole.createdAt;
    model.updatedAt = prismaRole.updatedAt;
    model.deletedAt = prismaRole.deletedAt;
    model.createdBy = prismaRole.createdBy;
    model.updatedBy = prismaRole.updatedBy;
    model.deletedBy = prismaRole.deletedBy;

    const role = prismaRole as PrismaRoleWithRelations;

    if (role.rolePermissions?.length > 0) {
      model.permissions = role.rolePermissions
        .filter((rp: any) => rp.permission)
        .map((rp: any) => PermissionMapper.toDomain(rp.permission));
    }

    return model;
  }
}
