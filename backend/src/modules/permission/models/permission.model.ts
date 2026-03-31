import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

/**
 * Domain model representing a granular permission.
 * Maps from Prisma Permission to application domain layer.
 */
export class PermissionModel {
  id: string;
  name: string;
  code: string;
  description?: string;
  group: string;
  action: EnumPolicyAction;
  subject: EnumPolicySubject;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<PermissionModel>) {
    Object.assign(this, data);
  }

  isActiveAndNotDeleted(): boolean {
    return this.isActive && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
