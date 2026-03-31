import {
  EnumCareRecordItemSource,
  EnumCareRecordItemType,
} from '../enums/care-record-item.enum';

/**
 * Domain model representing an item (part/service) within a care record.
 * Maps from Prisma CareRecordItem to application domain layer.
 */
export class CareRecordItemModel {
  id: string;
  source: EnumCareRecordItemSource;
  itemType: EnumCareRecordItemType;
  name?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  approvedByOwner?: boolean;
  note?: string;

  careRecordId: string;
  vehicleServiceId: string;
  partId?: string;
  technicianId?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CareRecordItemModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
