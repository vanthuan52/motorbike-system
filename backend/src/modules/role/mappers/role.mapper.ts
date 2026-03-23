import { RoleModel } from '../models/role.model';
import { EnumRoleType } from '../enums/role.enum';

export class RoleMapper {
  static toDomain(prismaRole: any): RoleModel {
    const model = new RoleModel();
    model.id = prismaRole.id;
    model.name = prismaRole.name;
    model.description = prismaRole.description;
    model.isActive = prismaRole.isActive;
    model.type = prismaRole.type?.toLowerCase() as EnumRoleType;
    model.abilities = prismaRole.abilities;

    model.createdAt = prismaRole.createdAt;
    model.updatedAt = prismaRole.updatedAt;
    model.deletedAt = prismaRole.deletedAt;
    model.createdBy = prismaRole.createdBy;
    model.updatedBy = prismaRole.updatedBy;
    model.deletedBy = prismaRole.deletedBy;

    return model;
  }
}
