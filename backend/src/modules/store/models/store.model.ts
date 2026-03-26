import { EnumStoreStatus } from '../enums/store.enum';

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
}
