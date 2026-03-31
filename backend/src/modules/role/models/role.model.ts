/**
 * Domain model representing a system role.
 * Maps from Prisma Role to application domain layer.
 */
export class RoleModel {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  type: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<RoleModel>) {
    Object.assign(this, data);
  }

  isActiveAndNotDeleted(): boolean {
    return this.isActive && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
