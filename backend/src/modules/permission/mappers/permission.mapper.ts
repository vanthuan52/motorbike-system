import { PermissionModel } from '../models/permission.model';
import { EnumRoleType } from '../enums/permission.enum';

export class PermissionMapper {
  static toDomain(prismaPermission: any): PermissionModel {
    const model = new PermissionModel();
    model.id = prismaPermission.id;
    model.name = prismaPermission.name;
    model.description = prismaPermission.description;
    model.isActive = prismaPermission.isActive;
    model.type = prismaPermission.type?.toLowerCase() as EnumRoleType;
    model.abilities = prismaPermission.abilities;

    model.createdAt = prismaPermission.createdAt;
    model.updatedAt = prismaPermission.updatedAt;
    model.deletedAt = prismaPermission.deletedAt;
    model.createdBy = prismaPermission.createdBy;
    model.updatedBy = prismaPermission.updatedBy;
    model.deletedBy = prismaPermission.deletedBy;

    return model;
  }
}
