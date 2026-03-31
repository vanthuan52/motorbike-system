import { EnumStatus } from '@/common/enums/common.enum';

/**
 * Domain model representing a vehicle part.
 * Maps from Prisma Part to application domain layer.
 */
export class PartModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: EnumStatus;
  orderBy: string;

  partTypeId: string;
  vehicleBrandId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<PartModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
