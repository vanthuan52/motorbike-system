import { RoleModel } from '../models/role.model';

export class RoleMapper {
  static toDomain(prismaRole: any): RoleModel {
    const model = new RoleModel();
    model.id = prismaRole.id;
    model.name = prismaRole.name;
    model.description = prismaRole.description;
    model.isActive = prismaRole.isActive;
    model.type = prismaRole.type?.toLowerCase();

    model.createdAt = prismaRole.createdAt;
    model.updatedAt = prismaRole.updatedAt;
    model.deletedAt = prismaRole.deletedAt;
    model.createdBy = prismaRole.createdBy;
    model.updatedBy = prismaRole.updatedBy;
    model.deletedBy = prismaRole.deletedBy;

    return model;
  }
}
