import { EnumStoreStatus } from '../enums/store.enum';

/**
 * Domain model representing a physical store location.
 * Maps from Prisma Store to application domain layer.
 */
export class StoreModel {
  id: string;
  name: string;
  address: string;
  workHours: string;
  description?: string;
  slug: string;
  status: EnumStoreStatus;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<StoreModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumStoreStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
