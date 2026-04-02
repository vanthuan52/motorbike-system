import { PermissionModel } from '../models/permission.model';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

export class PermissionMapper {
  static toDomain(prismaPermission: any): PermissionModel {
    const model = new PermissionModel();
    model.id = prismaPermission.id;
    model.name = prismaPermission.name;
    model.code = prismaPermission.code;
    model.description = prismaPermission.description;
    model.group = prismaPermission.group;
    model.action = prismaPermission.action as EnumPolicyAction;
    model.subject = prismaPermission.subject as EnumPolicySubject;
    model.isActive = prismaPermission.isActive;

    model.createdAt = prismaPermission.createdAt;
    model.updatedAt = prismaPermission.updatedAt;

    return model;
  }
}
