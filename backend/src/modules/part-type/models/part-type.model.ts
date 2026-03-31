import { EnumStatus } from '@/common/enums/common.enum';

/**
 * Domain model representing a part type/category.
 * Maps from Prisma PartType to application domain layer.
 */
export class PartTypeModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: string;
  status: EnumStatus;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<PartTypeModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
