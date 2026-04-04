import { PermissionModel } from '../models/permission.model';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { Permission as PrismaPermission } from '@/generated/prisma-client';

export class PermissionMapper {
  static toDomain(prismaPermission: PrismaPermission): PermissionModel {
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
    model.deletedAt = prismaPermission.deletedAt;
    model.createdBy = prismaPermission.createdBy;
    model.updatedBy = prismaPermission.updatedBy;
    model.deletedBy = prismaPermission.deletedBy;

    return model;
  }
}
