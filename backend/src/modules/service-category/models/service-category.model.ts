import { EnumStatus } from '@/common/enums/common.enum';

/**
 * Domain model representing a service category.
 * Maps from Prisma ServiceCategory to application domain layer.
 */
export class ServiceCategoryModel {
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

  constructor(data?: Partial<ServiceCategoryModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
